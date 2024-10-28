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

// Fetch profile of any user
UserRouter.route('/key/:userId').get(UserController.getUserProfile);
// Fetch self profile
UserRouter.route('/self').get(AuthenticateUser, UserController.getSelfProfile);
// Update self's profile name
UserRouter.route('/update-self-name').post(AuthenticateUser, UserController.updateSelfName);
// Update self's profile description
UserRouter.route('/update-self-description').post(AuthenticateUser, UserController.updateSelfDescription);
// Update self's profile banner image
UserRouter.route('/update-self-banner-image').post(AuthenticateUser, UserController.updateSelfBannerImage);
// Update self's profile avatar image
UserRouter.route('/update-self-avatar-image').post(AuthenticateUser, UserController.updateSelfAvatarImage);

// Update self's password

export default UserRouter;