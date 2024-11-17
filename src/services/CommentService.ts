import { Op } from "sequelize";

import Comment from "../models/Comment";
import Video from "../models/Video";
import User from "../models/User";
import sequelize from "sequelize";

class CommentService {
  static findVideoCommentIds = async (videoId: string): Promise<string[] | Error> => {
    try {
      if (!videoId) throw new Error("Invalid video key");

      const video = await Video.findByPk(videoId);
      if (!video) throw new Error("Video not found");
      if (video instanceof Error) throw video;

      const comments = await Comment.findAll({
        where: {
          videoId: video.videoId, // Replace 'someVideoId' with your actual videoId
          parentCommentId: {[Op.or]: ["", null]}        },
      });
      
      if (comments instanceof Error) throw comments;
      else return comments.map(item => item.commentId);
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static findCommentById = async (commentId: string) => {
    try {
      if (!commentId) throw new Error("Invalid comment key");

      const comment = await Comment.findByPk(commentId);
      if (!comment) throw new Error("Comment not found");
      if (comment instanceof Error) throw comment;

      return comment;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static createComment = async (
    userId: string,
    videoId: string,
    content: string,
    parentCommentId: string | null,
  ) => {
    try {
      // validate userId
      if (!userId) throw new Error("Invalid user Id");
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");
      if (user instanceof Error) throw user;
      // validate videoId
      if (!videoId) throw new Error("Invalid video key");
      const video = await Video.findByPk(videoId);
      if (!video) throw new Error("Video not found");
      if (video instanceof Error) throw video;
      // validate parentComentId if it is not null
      if (parentCommentId !== null && parentCommentId !== "") {
        const parentComment = await Comment.findByPk(parentCommentId);
        if (!parentComment) throw new Error("Parent comment not found");
        if (parentComment instanceof Error) throw parentComment;
      }
      // validate content
      if (!content) throw new Error("Empty content");
      // try to create
      const result = await Comment.create({
        userId: user.userId,
        videoId: video.videoId,
        content: content,
        parentCommentId: parentCommentId
      });
      if (result instanceof Error) throw result;
      return result;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static updateCommentContent = async (
    commentId: string,
    newContent: string
  ) => {
    try {
      // validate commentId
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await Comment.findByPk(commentId);
      if (!comment) throw new Error("Comment not found");
      if (comment instanceof Error) throw comment;
      // validate new content
      if (!newContent) throw new Error("Empty new content");
      // update new content
      comment.content = newContent;
      await comment.save();
      return comment;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static deleteComment = async (
    commentId: string
  ) => {
    try {
      // validate commentId
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await Comment.findByPk(commentId);
      if (!comment) throw new Error("Comment not found");
      if (comment instanceof Error) throw comment;
      // delete comment
      await comment.destroy();
      return "Comment is deleted"
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static isParentComment = async (commentId: string) => {
    try {
      // validate commentId
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await Comment.findByPk(commentId);
      if (!comment) throw new Error("Comment not found");
      if (comment instanceof Error) throw comment;
      // check if this comment is a parent comment of any other comment
      const childComments = await Comment.findAll({
        where: {
          parentCommentId: {[Op.eq]: comment.commentId}
        }
      });
      if (childComments instanceof Error) throw childComments;
      console.log(childComments.length);
      return childComments.length > 0;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);      
    }
  };

  static findChildCommentIds = async (commentId: string) => {
    try {
      // validate commentId
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await Comment.findByPk(commentId);
      if (!comment) throw new Error("Comment not found");
      if (comment instanceof Error) throw comment;
      // check if this comment is a parent comment of any other comment
      const childComments = await Comment.findAll({
        where: {
          parentCommentId: {[Op.eq]: comment.commentId}
        }
      });
      if (childComments instanceof Error) throw childComments;
      return childComments.map(item => item.commentId);
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);      
    }
  };
}

export default CommentService;