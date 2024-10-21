import { Optional } from "sequelize";

export interface VideoStatistic_Interface {
  videoId: string;
  duration: number;
  viewCount: number;
  lastUpdatedViewCount: Date;
  likeCount: number;
  lastUpdatedLikeCount: Date;
  dislikeCount: number;
  lastUpdatedDislikeCount: Date;
}
export interface VideoStatistic_CreationInterface extends Optional<
  VideoStatistic_Interface,
  "duration" | "viewCount" | "lastUpdatedViewCount" | "likeCount" | "lastUpdatedLikeCount" | "dislikeCount" | "lastUpdatedDislikeCount"
>{};