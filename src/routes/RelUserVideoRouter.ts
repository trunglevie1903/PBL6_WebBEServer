import { Router } from "express";

import RelUserVideoController from "../controllers/RelUserVideoController";
import AuthenticateUser from "../middlewares/AuthenticateUser";

const RelUserVideoRouter = Router();

// RelUserVideoRouter.route("/create-like-status").post(AuthenticateUser, RelUserVideoController.createLikeStatus);
RelUserVideoRouter.route("/update-like-status").post(AuthenticateUser, RelUserVideoController.updateLikeStatus);
RelUserVideoRouter.route("/delete-like-status").post(AuthenticateUser, RelUserVideoController.deleteLikeStatus);
RelUserVideoRouter.route("/get-like-status/:videoId").get(AuthenticateUser, RelUserVideoController.findLikeStatus);
RelUserVideoRouter.route("/get-like-count/:videoId").get(RelUserVideoController.countLikeStatus);
RelUserVideoRouter.route("/get-dislike-count/:videoId").get(RelUserVideoController.countDislikeStatus);

export default RelUserVideoRouter;