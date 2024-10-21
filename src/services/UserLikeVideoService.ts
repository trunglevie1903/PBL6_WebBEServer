import { Op } from "sequelize";

import UserLikeVideo from "../models/UserLikeVideo";
import { LikeStatus } from "../interfaces/UserLikeVideo_Interface";

export default class UserLikeVideoSerVice {
  static createStatus = async (
    userId: string, videoId: string, likeStatus: typeof LikeStatus[number]
  ) => {
    try {
      const status = await UserLikeVideo.create({
        userId, videoId, likeStatus
      });
      if (!status) throw new Error("Unexpected error when creating like status");
      if (status instanceof Error) throw status;
      else return status;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };
  
  static updateStatus = async (userId: string, videoId: string, likeStatus: typeof LikeStatus[number]) => {
    try {
      const status = await UserLikeVideo.findOrCreate({
        where: {
          userId, videoId, likeStatus
        }
      });
      if (!status) throw new Error("Unexpected error when updating like status");
      if (status instanceof Error) throw status;
      else return 1;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error)
    }
  };

  static deleteStatus = async (userId: string, videoId: string) => {
    try {
      const status = await UserLikeVideo.findOne({
        where: {
          userId: {[Op.eq]: userId},
          videoId: {[Op.eq]: videoId}
        }
      });
      if (!status) throw new Error("Like status not found");
      if (status instanceof Error) throw status;
      await status.destroy();
      return 1;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error)
    }
  };

  static findStatus = async (userId: string, videoId: string) => {
    try {
      const status = await UserLikeVideo.findOne({
        where: {
          userId, videoId
        }
      });
      if (!status) return {userId, videoId, likeStatus: null} as UserLikeVideo;
      if (status instanceof Error) throw status;
      else return status;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static countLikeStatus = async (videoId: string) => {
    try {
      const amount = await UserLikeVideo.count({
        where: {
          videoId,
          likeStatus: "liked"
        }
      });
      if (amount === null || amount === undefined) throw new Error("Unexpected error counting likes");
      else return amount;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static countDislikeStatus = async (videoId: string) => {
    try {
      const amount = await UserLikeVideo.count({
        where: {
          videoId,
          likeStatus: "disliked"
        }
      });
      if (amount === null || amount === undefined) throw new Error("Unexpected error counting dislikes");
      else return amount;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };
}