import { Optional } from "sequelize";

export const LikeStatus = ['liked', 'disliked'] as const;

export interface UserLikeVideo_Interface {
  userId: string;
  videoId: string;
  likeStatus: typeof LikeStatus[number];
}

export interface UserLikeVideo_CreationInterface extends Optional<
  UserLikeVideo_Interface,
  null
>{};