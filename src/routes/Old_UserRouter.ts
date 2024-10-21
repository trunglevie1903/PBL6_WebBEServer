// import { Request, Response, Router } from "express";
// import multer from "multer";

// import UserController from "../controllers/UserController";
// import AuthenticateUser from "../middlewares/AuthenticateUser";

// const uploadUserImages = multer({
//   storage: multer.memoryStorage()
// });

// const UserRouter = Router();

// UserRouter.route("/register").post(UserController.registerUser);
// UserRouter.route("/delete/u/:username").post(UserController.deleteUser_username);
// UserRouter.route("/delete/:userId").post(UserController.deleteUser);
// UserRouter.route("/login").post(UserController.loginUser);
// UserRouter.route("/logout").post(AuthenticateUser, UserController.logoutUser);
// UserRouter.route("/username/:username").get(UserController.findByUsername);
// UserRouter.route("/id/:userId").get(UserController.findById);

// UserRouter.route('/upload_images').post(uploadUserImages.fields([
//   { name: "banner" }, { name: "avatar"}
// ]), async (
//   req: Request, res: Response
// ) => {
  
// });

// export default UserRouter;