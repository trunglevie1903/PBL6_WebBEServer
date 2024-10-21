import { Request, Response } from "express";
import UserService from "../services/UserService";
import UserProfileService from "../services/UserProfileService";

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

      const userProfile = await UserProfileService.findByPk(userId);
      if (userProfile instanceof Error) throw userProfile;

      const user = await UserService.findByPk(userProfile.userId);
      if (user instanceof Error) throw user;
      return res.status(200).json({
        profile: {
          username: user.username,
          avatarImage: userProfile.avatarImage,
        }
      })
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };
}

export default UserController;