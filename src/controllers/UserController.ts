import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import multer from "multer";

import UserService from "../services/UserService";
import UserProfileService from "../services/UserProfileService";
import ForgotPasswordService from "../services/PasswordResetService";

const getUserIdFromUserName = async (username: string | null) => {
  if (username === null || username === "") return "";
  const user = await UserService.findByUsername(username);
  const userId = user instanceof Error ? "" : user.userId;
  return userId;
}; 

const createMulterStorage = (folderPath: string) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folderPath)
  },
  filename: (req, file, cb) => {
    const userId = getUserIdFromUserName(req.user.username);
    cb(null, `${userId}.png`);
  }
});
const bannerStorage = createMulterStorage("uploads/banners");
const avatarStorage = createMulterStorage("uploads/avatars");

const uploadBanner = multer({ storage: bannerStorage }).single("bannerImage");
const uploadAvatar = multer({ storage: avatarStorage }).single("avatarImage");

const readImageAsString = async (imagePath: string, defaultPath: string): Promise<string | Error> => {
  try {
    const validPath = fs.existsSync(imagePath) ? imagePath : defaultPath;
    const imageData = await fs.promises.readFile(validPath);
    const base64Image = imageData.toString('base64');
    const ext = path.extname(validPath).substring(1);
    return `data:image/${ext};base64,${base64Image}`;
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : error);
  }
};

const readAvatarAsString = async (imagePath: string) => {
  return await readImageAsString(imagePath, "uploads/avatars/default_avatar.jpg");
};
const readBannerAsString = async (imagePath: string) => {
  return await readImageAsString(imagePath, "uploads/banners/default_banner.png");
};

class UserController {
  static registerUser = async (
    req: Request, res: Response
  ) => {
    console.log('Registering a new user...');
    // Extract data from request
    const { name, username, email, password } = req.body;
    try {
      // If there is an empty value in any of 4 fields, throw Error
      if (!name || !username || !email || !password) throw new Error("Request failed - Empty data detected.");
      // If the username is used, throw Error
      if (await UserService.findByUsername(username) !== null) throw new Error("Request failed - Username is used");
      // If the password is invalid, throw Error
      if (await new RegExp(/^[a-zA-Z0-9~!@#$%^&*()]+$/).test(password) === false) throw new Error("Request failed - Invalid password");
      // Try to create a new user, if encounter an error then throw it, else return the created user
      const result = await UserService.registerUser(name, username, email, password);
      if (result instanceof Error) throw result;
      else return res.status(201).json({message: "User created"});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: (error instanceof Error ? error.message : error)});
    }
  };

  static loginUser = async (
    req: Request, res: Response
  ) => {
    console.log('A user is logging in...');
    const {username, password} = req.body;
    // console.log(username, password);
    try {
      // Extract data from request body
      // If any field in request body is empty => throw Error
      if (!username || !password) throw new Error("Request failed - Empty data detected");
      // If input username does not match any user => throw Error
      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;
      if (user === null || user === undefined || Object.keys(user).length === 0) throw new Error("Request failed - Username mismatch");
      // Try to log in
      return res.status(200).json(await UserService.loginUser(username, password));
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: (error instanceof Error ? error.message : error)});
    }
  };

  static refreshToken = async (
    req: Request, res: Response
  ) => {
    console.log("Requested to refresh authentication token...");
    const {refreshToken} = req.body;
    // Extract refreshToken from request body
    try {
      // If refreshToken is empty => throw
      if (!refreshToken) throw new Error("Empty token");
      // Try to make a new payload from received refreshToken
      const payload = await UserService.refreshToken(refreshToken);
      if (payload instanceof Error) throw payload;
      else res.status(200).json(payload);
    } catch (error) {
      console.error(error);
      res.status(400).json({message: (error instanceof Error ? error.message : error)});
    }
  }

  static logOutUser = async (
    req: Request, res: Response
  ) => {
    const username = req.user?.username || "";
    try {
      if (!username) throw new Error("Invalid request data");
      const result = await UserService.logOutUser(username);
      if (result instanceof Error) throw result;
      else res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({message: (error instanceof Error ? error.message : error)});
    }
  };

  static authenticateAccount = async (req: Request, res: Response) => {
    const {username, role} = req.user;
    try {
      if (!username || !role) throw new Error("Invalid request data");
      else return res.status(200).json();
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: (error instanceof Error ? error.message : error)});
    }
  };

  static findUserByPk = async (req: Request, res: Response) => {
    const {userId} = req.params;
    try {
      if (!userId) throw new Error("Invalid user ID");
      
      const user = await UserService.findByPk(userId);
      if (user instanceof Error) throw user;
      else return res.status(200).json({user});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static getUserInfoForSmallCard = async (req: Request, res: Response) => {
    const {userId} = req.params;
    try {
      if (!userId) throw new Error("Invalid user ID");

      const user = await UserService.findByPk(userId);
      if (user instanceof Error) throw user;

      const userProfile = await UserProfileService.findByPk(user.userId);
      if (userProfile instanceof Error) throw userProfile;

      const avatarImage = await readAvatarAsString(userProfile.avatarImagePath);
      if (avatarImage instanceof Error) throw avatarImage;

      const returnData = {
        username: user.username,
        avatarImage
      };
      return res.status(200).json({profile: returnData});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static getUserProfile = async (req: Request, res: Response) => {
    try {
      const userId: string | null = req.params.userId;
      if (!userId || userId === "") throw new Error("Invalid user ID");

      const user = await UserService.findByPk(userId);
      if (user instanceof Error) throw user;

      const userProfile = await UserProfileService.findByPk(user.userId);
      if (userProfile instanceof Error) throw userProfile;

      const bannerImage = await readBannerAsString(userProfile.bannerImagePath);
      if (bannerImage instanceof Error) throw bannerImage;

      const avatarImage = await readAvatarAsString(userProfile.avatarImagePath);
      if (avatarImage instanceof Error) throw avatarImage;

      const returnData = {
        userId: user.userId,
        username: user.username,
        name: user.name,
        description: userProfile.description,
        bannerImage, avatarImage
      };
      return res.status(200).json({profile: returnData});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static getSelfProfile = async (req: Request, res: Response) => {
    try {
      const {username} = req.user;
      if (!username) throw new Error("You are not allowed to perform this action");

      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;
      
      const userProfile = await UserProfileService.findByPk(user.userId);
      if (userProfile instanceof Error) throw userProfile;

      const bannerImage = await readBannerAsString(userProfile.bannerImagePath);
      if (bannerImage instanceof Error) throw bannerImage;

      const avatarImage = await readAvatarAsString(userProfile.avatarImagePath);
      if (avatarImage instanceof Error) throw avatarImage;

      const returnData = {
        userId: user.userId,
        username: user.username,
        name: user.name,
        description: userProfile.description,
        bannerImage, avatarImage
      };
      return res.status(200).json({profile: returnData});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static updateSelfName = async (req: Request, res: Response) => {
    try {
      const {username} = req.user;
      if (!username) throw new Error("You are not allowed to perform this action");

      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;

      const {name} = req.body;
      if (!name || name === "") throw new Error("Empty data");

      user.name = name;
      await user.save();
      return res.status(200).json({message: "Name is updated"});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static updateSelfDescription = async (req: Request, res: Response) => {
    try {
      const {username} = req.user;
      if (!username) throw new Error("You are not allowed to perform this action");

      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;

      const userProfile = await UserProfileService.findByPk(user.userId);
      if (userProfile instanceof Error) throw userProfile;

      const {description} = req.body;

      userProfile.description = description;
      await userProfile.save();
      return res.status(200).json({message: "Description is updated"});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static updateSelfBannerImage = async (req: Request, res: Response) => {
    try {
      const { username } = req.user;
      if (!username) throw new Error("You are not allowed to perform this action");
  
      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;
  
      const userProfile = await UserProfileService.findByPk(user.userId);
      if (userProfile instanceof Error) throw userProfile;
  
      let { bannerImage } = req.body;
      if (!bannerImage || bannerImage === "") throw new Error("Empty data");
  
      // Remove the MIME prefix if present
      const base64Data = bannerImage.replace(/^data:image\/\w+;base64,/, "");
      const bannerImageBuffer = Buffer.from(base64Data, "base64");
  
      const filePath = path.join("uploads/banners", `${user.userId}.png`);
      await fs.promises.writeFile(filePath, bannerImageBuffer);
      userProfile.bannerImagePath = filePath;
      await userProfile.save();
  
      return res.status(200).json({ message: "Banner image is updated" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: `Error: ${error instanceof Error ? error.message : error}` });
    }
  };

  static updateSelfAvatarImage = async (req: Request, res: Response) => {
    try {
      const { username } = req.user;
      if (!username) throw new Error("You are not allowed to perform this action");
  
      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;
  
      const userProfile = await UserProfileService.findByPk(user.userId);
      if (userProfile instanceof Error) throw userProfile;
  
      let { avatarImage } = req.body;
      if (!avatarImage || avatarImage === "") throw new Error("Empty data");
  
      // Remove the MIME prefix if present
      const base64Data = avatarImage.replace(/^data:image\/\w+;base64,/, "");
      const avatarImageBuffer = Buffer.from(base64Data, "base64");
  
      const filePath = path.join("uploads/avatars", `${user.userId}.png`);
      await fs.promises.writeFile(filePath, avatarImageBuffer);
      userProfile.avatarImagePath = filePath;
      await userProfile.save();
  
      return res.status(200).json({ message: "Avatar image is updated" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: `Error: ${error instanceof Error ? error.message : error}` });
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    try {
      const {username} = req.user;
      if (!username) throw new Error("User not found");
      
      const {oldPassword, newPassword} = req.body;
      if (!oldPassword || !newPassword) throw new Error("New password does not meet the required criteria.");

      const result = await UserService.changePassword(username, oldPassword, newPassword);
      if (result instanceof Error) throw result;
      else return res.status(200).json(result);

    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        switch (message) {
          case "User not found":
            return res.status(404).json({message});
          case "New password cannot be the same as the old password.":
          case "New password does not meet the required criteria.":
            return res.status(400).json({message});
          case "The old password is incorrect.":
            return res.status(401).json({message});
          default:
            return res.status(500).json({message});
        }
      } else return res.status(500).json({message: error});
    }
  };

  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { username, email } = req.body;
      const token = await ForgotPasswordService.requestPasswordReset({ username, email });

      // Send a success response; token generation is logged for testing
      res.status(200).json({ message: "Reset instructions sent to email", token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await ForgotPasswordService.resetPassword({ token, newPassword });
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default UserController;