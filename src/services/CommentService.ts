import { Op } from "sequelize";

import Comment from "../models/Comment";
import { Comment_CreationInterface, Comment_Interface } from "../interfaces/Comment_Interface";
import VideoService from "./VideoService";
import UserService from "./UserService";

// interface ServiceResponse {
//   error: Error | null;
//   data: any
// };

interface DirectCommentObject {
  commentId: string;
  hasChildComment: boolean;
}

export default class CommentService {
  // Get the id list of a video's direct comments
  static getVideoDirectCommentIdList = async (videoId: string): Promise<DirectCommentObject[] | Error> => {
    try {
      // Validate the videoId
      if (!videoId) throw new Error("Invalid video key");
      const video = await VideoService.findVideoById(videoId);
      if (video === null) throw new Error("Video was not found");

      // Query the video's direct comments
      const comments = await Comment.findAll({
        where: {
          videoId: {[Op.eq]: video.videoId},
          parentCommentId: {[Op.eq]: null}
        }
      });
      if (comments instanceof Error) throw comments;
      // console.log('comments: ', comments);

      // Extract the id into the list and return that list
      const result: DirectCommentObject[] = await Promise.all(
        comments.map(async (item) => {
          const id = item.commentId;
          const childCommentIdList = await this.getChildCommentIdList(id);
          if (childCommentIdList instanceof Error) throw childCommentIdList;
          return { commentId: id, hasChildComment: childCommentIdList.length > 0 };
        })
      );
      console.log('result is: ', result);
      return result;
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error : new Error(error);
    }
  };

  // Get the content of a comment via its commentId
  static getCommentContent = async (commentId: string): Promise<Comment_Interface | Error> => {
    try {
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await Comment.findByPk(commentId);
      if (comment === null) throw new Error("Comment was not found");
      if (comment instanceof Error) throw comment;
      return comment;
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error : new Error(error);
    }
  };

  // Get the id list of a comment's child comments list
  static getChildCommentIdList = async (commentId: string): Promise<string[] | Error> => {
    try {
      if (!commentId) throw new Error("Invalid comment key");  
      const comments = await Comment.findAll({
        where: {
          parentCommentId: {[Op.eq]: commentId}
        }
      });
      if (comments instanceof Error) throw comments;
      
      const ids = comments.map(item => item.commentId);
      return ids;
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error : new Error(error);
    }
  };

  // Create a comment
  static createComment = async (data: Comment_CreationInterface): Promise<Comment_Interface | Error> => {
    try {
      if (!data.userId || !data.videoId || !data.content) throw new Error("Invalid data value");
      // Validate userId
      const user = await UserService.findByPk(data.userId);
      if (user instanceof Error) throw user;
      // Validate videoId
      const video = await VideoService.findVideoById(data.videoId);
      if (video === null) throw new Error("Video was not found");
      // Validate parentCommentId if there is
      if (data.parentCommentId !== null) {
        const parentComment = await Comment.findByPk(data.parentCommentId);
        if (parentComment === null) throw new Error("Parent comment was not found");
        if (parentComment instanceof Error) throw parentComment;
      }
      // Query to create
      const comment = await Comment.create(data);
      if (comment instanceof Error) throw comment;
      else return comment;
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error : new Error(error);
    }
  };

  // Delete a Comment
  static deleteComment = async (commentId: string): Promise<Object | Error> => {
    try {
      if (!commentId) throw new Error("Invalid comment key");
      const comment = await Comment.findByPk(commentId);
      if (comment instanceof Error) throw comment;
      await comment.destroy();
      return {};
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error : new Error(error);
    }
  };
}