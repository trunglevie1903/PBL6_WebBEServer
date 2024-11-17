import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { Op } from 'sequelize';

import { config } from '../config';
import User from "../models/User";
import UserAuthentication from '../models/UserAuthentication';
import PasswordResetTokenModel from '../models/PasswordResetToken';

const SALT_ROUNDS = 10;
const JWT_SECRET = config.jwtSecret;
const JWT_REFRESH_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = "15m";
const JWT_REFRESH_EXPIRES_IN = "7d";

class UserService {
  static findByUsername = async (
    username: string
  ): Promise<null | Error | User> => {
    try {
      const user = await User.findOne({
        where: {
          username: {
            [Op.eq]: username
          }
        }
      });
      if (!user) return null;
      if (user instanceof Error) throw user;
      else return user;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  static registerUser = async (
    name: string, username: string, email: string, password: string
  ) => {
    try {
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      const newUser = await User.create({name, username, email, password_hash});
      if (newUser instanceof Error) throw newUser;
      else return newUser;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  static loginUser = async (
    username: string, password: string
  ) => {
    const user = await User.findOne({
      where: {
        username: {
          [Op.eq]: username
        }
      }
    });
    const userAuthen = await UserAuthentication.findOne({
      where: {
        userId: {
          [Op.eq]: user.userId
        }
      }
    });

    if (userAuthen.isLocked && userAuthen.unlockTimestamp && userAuthen.unlockTimestamp > new Date()) return new Error("User is locked");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      userAuthen.loginAttempt += 1;
      if (userAuthen.loginAttempt >= 500) {
        userAuthen.isLocked = true;
        userAuthen.unlockTimestamp = new Date(Date.now() + 5*60*1000);
      }
      await userAuthen.save();
      await user.save();
      return new Error("Wrong username or password");
    }
    userAuthen.loginAttempt = 0;
    userAuthen.lastLogin = new Date();
    await userAuthen.save();

    const payload = {
      username: user.username,
      role: user.role
    };
    const accessToken = jwt.sign(
      payload,
      JWT_SECRET,
      {expiresIn: JWT_EXPIRES_IN}
    );
    const refreshToken = jwt.sign(
      payload,
      JWT_REFRESH_SECRET,
      {expiresIn: JWT_REFRESH_EXPIRES_IN}
    );
    userAuthen.refreshToken = refreshToken;
    await userAuthen.save();
    await user.save();

    return {
      accessToken, refreshToken
    };
    // console.log('user: ', user);
    // return user;
  };

  static refreshToken = async (
    oldToken: string
  ) => {
    try {
      const decoded = jwt.verify(oldToken, JWT_REFRESH_SECRET) as JwtPayload;
      console.log('decoded: ', decoded);
      if ("username" in decoded && decoded.username) {
        const user = await User.findOne({
          where: {
            username: {
              [Op.eq]: decoded.username
            }
          }
        });
        if (!user) throw new Error("User not found");

        const userAuth = await UserAuthentication.findByPk(user.userId);
        if (!userAuth) throw new Error("User not found");

        if (userAuth.refreshToken !== oldToken) throw new Error("Wrong token");
        else {
          const payload = {
            username: user.username,
            role: user.role
          };          
          const newAccessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
          const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_EXPIRES_IN})

          userAuth.refreshToken = newRefreshToken;
          await userAuth.save();
          
          return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          };
        }
      } else throw new Error("Invalid refresh token");
    } catch (error) {
      return new Error(error instanceof Error ? error.message: error);
    }
  };

  static logOutUser = async (username: string) => {
    try {
      const user = await User.findOne({
        where: {
          username: {
            [Op.eq]: username
          }
        }
      });
      if (!user) return new Error("User not found");
      
      const userAuth = await UserAuthentication.findByPk(user.userId);
      if (!userAuth) return new Error("User not found");
  
      userAuth.refreshToken = null;
      await userAuth.save();
      return {};
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static authenticateAccount = async (username: string, role: string) => {
    const user = await User.findOne({
      where: {
        username: {[Op.eq]: username},
        role: {[Op.eq]: role}
      }
    });
    if (!user || user instanceof Error) return false;
    else return true;
  };

  static findByPk = async (userId: string) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");
      if (user instanceof Error) throw user;

      return user;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static changePassword = async (username: string, oldPassword: string, newPassword: string) => {
    try {
      // Username not found => User not found
      if (!username) throw new Error("User not found");
      // Empty data
      if (!oldPassword || !newPassword) throw new Error("New password does not meet the required criteria.");
      // No user match username => User not found
      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw new Error("User not found");
      // If old password is not match
      if (bcrypt.compareSync(oldPassword, user.password_hash) === false) throw new Error("The old password is incorrect.");
      // New password match old password
      const isMatch = bcrypt.compareSync(newPassword, user.password_hash);
      if (isMatch) throw new Error("New password cannot be the same as the old password.");
      // Try to change user's password
      const newPasswordHashed = bcrypt.hashSync(newPassword, SALT_ROUNDS);
      user.password_hash = newPasswordHashed;
      await user.save();
      return ({message: "Password changed"});
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static searchUser = async (searchText: string) => {
    try {
      const result = await User.findAll({
        where: {
          [Op.or]: [
            {username: {[Op.like]: `%${searchText}`}},
            {name: {[Op.like]: `%${searchText}`}}
          ]
        }
      });
      if (result instanceof Error) throw result;
      else return result.map(item => item.userId);
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };
}

export default UserService;