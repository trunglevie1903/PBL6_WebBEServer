import { Request, Response } from "express";
import UserLikeVideoSerVice from "../services/UserLikeVideoService";
import UserService from "../services/UserService";

export default class RelUserVideoController {
  // static createLikeStatus = async (req: Request, res: Response) => {
  //   try {
  //     const {username} = req.user;
  //     if (!username) throw new Error("You are not authorized to perform this action");

  //     const user = await UserService.findByUsername(username);
  //     if (!user) throw new Error("Please log in");
  //     if (user instanceof Error) throw user;

  //     const userId = user.userId;
  //     const {videoId, likeStatus} = req.body;
  //     if (!userId || !videoId || !likeStatus) throw new Error("Invalid request data");

  //     const result = await UserLikeVideoSerVice.createStatus(userId, videoId, likeStatus);
  //     if (result instanceof Error) throw result;
  //     else return res.status(201).json({status: {...result}});
  //   } catch (error) {
  //     return res.status(400).json({message: error instanceof Error ? error.message : error});
  //   }
  // };

  static updateLikeStatus = async (req: Request, res: Response) => {
    try {
      const {username} = req.user;
      if (!username) throw new Error("You are not authorized to perform this action");

      const user = await UserService.findByUsername(username);
      if (!user) throw new Error("Please log in");
      if (user instanceof Error) throw user;

      const userId = user.userId;
      const {videoId, likeStatus} = req.body;
      if (!userId || !videoId || !likeStatus) throw new Error("Invalid request data");

      const result = await UserLikeVideoSerVice.updateStatus(userId, videoId, likeStatus);
      if (result instanceof Error) throw result;
      else return res.status(200).json({status: result});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  static deleteLikeStatus = async (req: Request, res: Response) => {
    try {
      const {username} = req.user;
      if (!username) throw new Error("You are not authorized to perform this action");

      const user = await UserService.findByUsername(username);
      if (!user) throw new Error("Please log in");
      if (user instanceof Error) throw user;

      const userId = user.userId;
      const {videoId} = req.body;
      if (!userId || !videoId) throw new Error("Invalid request data");

      const result = await UserLikeVideoSerVice.deleteStatus(userId, videoId);
      if (result instanceof Error) throw result;
      else return res.status(200).json({status: result});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  static findLikeStatus = async (req: Request, res: Response) => {
    try {
      const {username} = req.user;
      if (!username) throw new Error("You are not authorized to perform this action");

      const user = await UserService.findByUsername(username);
      if (!user) throw new Error("Please log in");
      if (user instanceof Error) throw user;

      const userId = user.userId;
      const {videoId} = req.params;
      if (!userId || !videoId) throw new Error("Invalid request data");

      const result = await UserLikeVideoSerVice.findStatus(userId, videoId);
      if (result instanceof Error) throw result;
      else return res.status(200).json({status: result.likeStatus});
    } catch (error) {
      return res.status(400).json({message: error instanceof Error ? error.message : error});
    }
  };

  static countLikeStatus = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");

      const amount = await UserLikeVideoSerVice.countLikeStatus(videoId);
      if (amount instanceof Error) throw amount;
      else return res.status(200).json({likeCount: amount});
    } catch (error) {
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static countDislikeStatus = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");

      const amount = await UserLikeVideoSerVice.countDislikeStatus(videoId);
      if (amount instanceof Error) throw amount;
      else return res.status(200).json({dislikeCount: amount});
    } catch (error) {
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };
}