import { Router } from "express";

import UserController from "../controllers/UserController";
import AuthenticateUser from "../middlewares/AuthenticateUser";
import UserService from "../services/UserService";

const UserRouter = Router();
UserRouter.route('/register').post(UserController.registerUser);
UserRouter.route('/login').post(UserController.loginUser);
UserRouter.route('/refresh-token').post(UserController.refreshToken);
UserRouter.route('/sign-out').post(AuthenticateUser, UserController.logOutUser);
UserRouter.route('/authenticate-account').post(AuthenticateUser, UserController.authenticateAccount);
UserRouter.route('/id/:userId').get(UserService.findByPk);
// Get username and user's avatar in video watching page
UserRouter.route('/profile-mini-card/:userId').get(UserController.getUserInfoForSmallCard);

export default UserRouter;