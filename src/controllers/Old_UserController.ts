// import { Request, Response } from "express";

// import UserService from "../services/UserService";

// class UserController {
//   static registerUser = async (
//     req: Request, res: Response
//   ) => {
//     console.log("Registering new account...");
//     const {
//       name, username, password, email
//     } = req.body;
//     try {
//       const newUser = await UserService.registerUser(
//         name, username, password, email
//       );
//       if (!newUser) throw new Error("Unexpected exception");
//       if (newUser instanceof Error) throw newUser;
//       console.log("New user created");
//       res.status(201).json({
//         username, email,
//         userId: newUser.user_id
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({err: error.message || error});
//     }
//   };

//   static deleteUser = async (
//     req: Request, res: Response
//   ) => {
//     const userId = req.params.userId;
//     try {
//       if (!userId) throw new Error("Invalid id");
//       const user = await UserService.findById(userId);
//       if (user instanceof Error) throw user;
//       const result = await UserService.deleteUser(user.user_id);
//       if (result instanceof Error) throw result;
//       res.status(200).json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ err: error.message || error });
//     }
//   };

//   static deleteUser_username = async (
//     req: Request, res: Response
//   ) => {
//     const username = req.params.username;
//     try {
//       if (!username) throw new Error("Invalid username");
//       const user = await UserService.findByUsername(username);
//       if (user instanceof Error) throw user;
//       const result = await UserService.deleteUser(user.user_id);
//       if (result instanceof Error) throw result;
//       res.status(200).json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ err: error.message || error });
//     }
//   };

//   static loginUser = async (
//     req: Request, res: Response
//   ) => {
//     console.log("[DEBUG] Logging user in...");
//     const { username, password } = req.body;
//     if (!username || !password) res.status(400).json({ error: "Empty username/password" });
//     try {
//       const result = await UserService.loginUser(username, password);
//       if (result instanceof Error) {
//         // console.error(result);
//         throw result;
//       }
//       else res.status(200).json({
//         accessToken: result.accessToken,
//         refreshToken: result.refreshToken,
//         userId: result.user.user_id,
//         role: result.user.role
//       });
//     } catch (err) {
//       res.status(400).json({
//         error: (err instanceof Error ? err.message : (err || "Wrong credentials"))
//       });
//     }
//   };

//   static logoutUser = async (
//     req: Request, res: Response
//   ) => {
//     const userId = req.user?.userId || "";
//     console.log('userId: ', userId);
//     try {
//       if (!userId || userId === "") throw new Error("User not found");
//       const result = await UserService.logoutUser(userId);
//       if (result instanceof Error) throw result;
//       else res.status(200).json(result);
//     } catch (err) {
//       res.status(400).json({
//         error: (err instanceof Error) ? err.message : (err || "User not found")
//       });
//     }
//   };

//   static findById = async (
//     req: Request, res: Response
//   ) => {
//     const userId = req.params.userId;
//     try {
//       if (!userId) throw new Error("Invalid id");
//       const result = await UserService.findById(userId);
//       if (result instanceof Error) throw result;
//       else res.status(200).json(result);
//     } catch (err) {
//       res.status(400).json({
//         error: (err instanceof Error) ? err.message : (err || "User not found")
//       });
//     }
//   }

//   static findByUsername = async (
//     req: Request, res: Response
//   ) => {
//     let username = req.params.username;
//     try {
//       if (!username) throw new Error("Invalid username");
//       const result = await UserService.findByUsername(username);
//       if (result instanceof Error) throw result;
//       else res.status(200).json(result);
//     } catch (err) {
//       res.status(400).json({
//         error: (err instanceof Error) ? err.message : (err || "User not found")
//       });
//     }
//   };
// }

// export default UserController;