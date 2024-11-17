import { Router } from "express";

import CommentController from "../controllers/CommentController";
import AuthenticateUser from "../middlewares/AuthenticateUser";

const CommentRouter = Router();

CommentRouter.route('/video/:videoId').get(CommentController.findVideoCommentIds);
CommentRouter.route('/id/:commentId').get(CommentController.findCommentById);
CommentRouter.route('/create').post(AuthenticateUser, CommentController.createComment);
CommentRouter.route('/update/:commentId').post(AuthenticateUser, CommentController.updateComment);
CommentRouter.route('/delete/:commentId').post(AuthenticateUser, CommentController.deleteComment);
CommentRouter.route('/is-parent/:commentId').get(CommentController.isParentComment);
CommentRouter.route('/find-child-comment/:commentId').get(CommentController.findChildCommentIds);

export default CommentRouter;