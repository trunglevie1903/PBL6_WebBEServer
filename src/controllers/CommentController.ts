import { Request, Response } from "express";

import CommentService from "../services/CommentService";
import VideoService from "../services/VideoService";
import UserService from "../services/UserService";

export default class CommentController {
  // Get the id list of a video's direct comments
  static getVideoDirectCommentIdList = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");
      const video = await VideoService.findVideoById(videoId);
      if (video === null) throw new Error("Video was not found");

      const list = await CommentService.getVideoDirectCommentIdList(video.videoId);
      if (list instanceof Error) throw list;
      else return res.status(200).json({list: list});
    } catch (error) {
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  // Get the content of a comment via its commentId
  static getCommentContent = async (req: Request, res: Response) => {
    try {
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await CommentService.getCommentContent(commentId);
      if (comment instanceof Error) throw comment;
      else return res.status(200).json({comment: comment});
    } catch (error) {
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  // Get the id list of a comment's child comments list
  static getChildCommentIdList = async (req: Request, res: Response) => {
    try {
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await CommentService.getCommentContent(commentId);
      if (comment instanceof Error) throw comment;
      const ids = await CommentService.getChildCommentIdList(comment.commentId);
      if (ids instanceof Error) throw ids;
      else return res.status(200).json({ids: ids});
    } catch (error) {
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  // Create a comment
  static createComment = async (req: Request, res: Response) => {
    try {
      // Authorize actor
      const {username} = req.user;
      if (!username) throw new Error("You are not authorized to perform this action");
      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;
      // Validate videoId and content if any of them are null
      const {videoId, content, parentCommentId} = req.body;
      if (!videoId || !content) throw new Error("Invalid data value");
      // Validate if videoId is real
      const video = await VideoService.findVideoById(videoId);
      if (video === null) throw new Error("Video was not found");
      // Validate parentCommentId (if the value is not null) if there is a comment with that id
      if (parentCommentId) {
        const parentComment = await CommentService.getCommentContent(parentCommentId);
        if (parentComment instanceof Error) throw parentComment;
      }
      // Try to create the new comment and return it
      const data = {userId: user.userId, videoId: video.videoId, parentCommentId: parentCommentId, content: content};
      const newComment = await CommentService.createComment(data);
      if (newComment instanceof Error) throw newComment;
      else return res.status(201).json({comment: newComment});
    } catch (error) {
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };
  
  // Delete a comment
  static deleteComment = async (req: Request, res: Response) => {
    try {
      // Authorize actor
      const {username} = req.user;
      if (!username) throw new Error("You are not authorized to perform this action");
      const user = await UserService.findByUsername(username);
      if (user instanceof Error) throw user;
      // Validate commentId if it is not null
      const {commentId} = req.params;
      if (!commentId) throw new Error("Invalid comment key");
      // Validate commentId if there is a comment with that id
      const comment = await CommentService.getCommentContent(commentId);
      if (comment instanceof Error) throw comment;
      // Try to delete the comment
      const result = await CommentService.deleteComment(comment.commentId);
      if (result instanceof Error) throw result;
      else return res.status(200).json({message: "comment was deleted"});
    } catch (error) {
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };
}