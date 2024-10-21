// import bcrypt from 'bcrypt';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { Op } from 'sequelize';

// import { config } from '../config';
// import User from '../models/User';

// const SALT_ROUNDS = 10;
// const JWT_SECRET = config.jwtSecret;
// const JWT_REFRESH_SECRET = config.jwtSecret;
// const JWT_EXPIRES_IN = "15m";
// const JWT_REFRESH_EXPIRES_IN = "7d";

// class UserService {
//   static registerUser = async (
//     name: string, username: string, password: string, email: string
//   ) => {
//     const user = await User.findOne({
//       where: {
//         username: {
//           [Op.eq]: username
//         }
//       }
//     });
//     if (user) return new Error("Username is used");
//     const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
//     const newUser = await User.create({
//       name, username, password_hash, email
//     });
//     return newUser;
//   };

//   static deleteUser = async (
//     userId: string
//   ) => {
//     const user = await User.findByPk(userId);
//     if (!user) return new Error("User not found");
//     await user.destroy();
//     return {};
//   };

//   static findByUsername = async (
//     username: string
//   ) => {
//     const user = await User.findOne({
//       where: {
//         username: {
//           [Op.eq]: username
//         }
//       }
//     });
//     if (!user) return new Error("User not found");
//     return user;
//   };

//   static findById = async (
//     userId: string
//   ) => {
//     const user = await User.findByPk(userId);
//     if (!user) return new Error("User not found");
//     return user;
//   };

//   static loginUser = async (
//     username: string, password: string
//   ) => {
//     const user = await User.findOne({
//       where: {
//         username: {
//           [Op.eq]: username
//         }
//       }
//     });
//     if (!user) return new Error("User not found");
//     if (user.is_locked && user.unlock_timestamp && user.unlock_timestamp > new Date()) return new Error("User is locked");

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       user.login_attempts += 1;
//       if (user.login_attempts >= 500) {
//         user.is_locked = true;
//         user.unlock_timestamp = new Date(Date.now() + 5*60*1000);
//       }
//       await user.save();
//       return new Error("Wrong username/password");
//     }

//     user.login_attempts = 0;
//     user.last_login = new Date();
//     await user.save();

//     const payload = {
//       userId: user.user_id,
//       role: user.role
//     };
//     const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
//     const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
//     user.refresh_token = refreshToken;
//     await user.save();

//     return {
//       user, accessToken, refreshToken
//     };
//   }

//   static logoutUser = async (
//     userId: string
//   ) => {
//     const user = await User.findByPk(userId);
//     if (!user) return new Error("User not found");

//     user.refresh_token = null;
//     await user.save();
//     return {};
//   };
// }

// export default UserService;