import { Router } from "express";

import CommentController from "../controllers/CommentController";
import AuthenticateUser from "../middlewares/AuthenticateUser";

const CommentRouter = Router();

// Get the id list of a video's direct comments
CommentRouter.route("/get-direct-comment/:videoId").get(CommentController.getVideoDirectCommentIdList);

// Get the content of a comment via its commentId
CommentRouter.route("/get-comment-content/:commentId").get(CommentController.getCommentContent);

// Get the id list of a comment's child comments list
CommentRouter.route("/get-child-comment/:commentId").get(CommentController.getChildCommentIdList);

// Create a comment
CommentRouter.route("/create-comment").post(AuthenticateUser, CommentController.createComment);

// Delete a comment
CommentRouter.route("/delete-comment/:commentId").post(AuthenticateUser, CommentController.deleteComment);

export default CommentRouter;