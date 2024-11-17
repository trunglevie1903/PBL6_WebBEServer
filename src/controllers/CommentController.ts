import { Request, Response } from "express";

import CommentService from "../services/CommentService";
import VideoService from "../services/VideoService";
import UserService from "../services/UserService";

export default class CommentController {
  // "/comment/video/:videoId"
  // {ids: <string[]>}
  static findVideoCommentIds = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");

      const result = await CommentService.findVideoCommentIds(videoId);
      if (result instanceof Error) throw result;
      else return res.status(200).json({ids: result});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  // "/comment/id/:commentId"
  // {commentId: <string>, userId: <string>, videoId: <string>, content: <string>, createdTime: <Date>}
  static findCommentById = async (req: Request, res: Response) => {
    try {
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await CommentService.findCommentById(commentId);
      if (comment instanceof Error) throw comment;
      else return res.status(200).json({comment: comment});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  // "/comment/create"
  // {commentId: <string>, userId: <string>, videoId: <string>, content: <string>, createdTime: <Date>}
  static createComment = async (req: Request, res: Response) => {
    try {
      // validate user
      const user = await UserService.findByUsername(req.user.username);
      if (!user) throw new Error("User not found");
      if (user instanceof Error) throw user;
      // extract request body
      const {videoId, content, parentCommentId} = req.body;
      if (!videoId || !content) throw new Error("Empty data");
      // validate video
      const video = await VideoService.findVideoById(videoId);
      if (!video) throw new Error("Video not found");
      // try to create
      const comment = await CommentService.createComment(user.userId, video.videoId, content, parentCommentId);
      if (comment instanceof Error) throw comment;
      else return res.status(201).json({comment: comment});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  // "/comment/update/:commentId"
  // {commentId: <string>, userId: <string>, videoId: <string>, content: <string>, createdTime: <Date>}
  static updateComment = async (req: Request, res: Response) => {
    try {
      // validate user
      const user = await UserService.findByUsername(req.user.username);
      if (!user) throw new Error("User not found");
      if (user instanceof Error) throw user;
      // validate commentId
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await CommentService.findCommentById(commentId);
      if (comment instanceof Error) throw comment;
      if (comment.userId !== user.userId) throw new Error("You are not allowed to change this comment");
      // extract request body
      const {newContent} = req.body;
      if (!newContent) throw new Error("Empty data");
      const newComment = await CommentService.updateCommentContent(comment.commentId, newContent);
      if (newComment instanceof Error) throw newComment;
      else return res.status(200).json({newComment: newComment});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  // "/comment/delete/:commentId"
  // {"Deleted"}
  static deleteComment = async (req: Request, res: Response) => {
    try {
      // validate user
      const user = await UserService.findByUsername(req.user.username);
      if (!user) throw new Error("User not found");
      if (user instanceof Error) throw user;
      // validate commentId
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await CommentService.findCommentById(commentId);
      if (comment instanceof Error) throw comment;
      if (comment.userId !== user.userId) throw new Error("You are not allowed to change this comment");
      // try to delete
      const result = await CommentService.deleteComment(comment.commentId);
      if (result instanceof Error) throw result;
      else return res.status(200).json({message: result});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  // "/comment/is-parent/:commentId"
  // {message: "Yes" | "No"}
  static isParentComment = async (req: Request, res: Response) => {
    try {
      // validate commentId
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await CommentService.findCommentById(commentId);
      if (comment instanceof Error) throw comment;
      // check if this comment is a parent comment of any comment
      const isParent = await CommentService.isParentComment(commentId);
      console.log('isParent: ', isParent);
      if (isParent instanceof Error) throw isParent;
      else return res.status(200).json({message: isParent ? "Yes" : "No"});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  // "/comment/find-child-comment/:commentId"
  // {ids: <string[]>}
  static findChildCommentIds = async (req: Request, res: Response) => {
    try {
      // validate commentId
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await CommentService.findCommentById(commentId);
      if (comment instanceof Error) throw comment;
      const childComments = await CommentService.findChildCommentIds(comment.commentId);
      if (childComments instanceof Error) throw childComments;
      else return res.status(200).json({ids: childComments});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };
}