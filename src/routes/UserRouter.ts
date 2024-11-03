import { Router } from "express";

import UserController from "../controllers/UserController";
import AuthenticateUser from "../middlewares/AuthenticateUser";

const UserRouter = Router();
// Register new user
UserRouter.route('/register').post(UserController.registerUser);
// User log in
UserRouter.route('/login').post(UserController.loginUser);
// Refresh authentication token
UserRouter.route('/refresh-token').post(UserController.refreshToken);
// User log out
UserRouter.route('/sign-out').post(AuthenticateUser, UserController.logOutUser);
// User authenticate account
UserRouter.route('/authenticate-account').post(AuthenticateUser, UserController.authenticateAccount);
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
// User change password
UserRouter.route('/change-password').post(AuthenticateUser, UserController.changePassword);
// User forgot password
UserRouter.route('/forgot-password').post(UserController.requestPasswordReset);
// User reset password
UserRouter.route('/reset-password').post(UserController.resetPassword);

export default UserRouter;