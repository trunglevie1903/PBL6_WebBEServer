import { DataTypes as DT, Model } from "sequelize";

import { sequelize } from "../config";
import { VideoStatistic_CreationInterface, VideoStatistic_Interface } from "../interfaces/VideoStatistic_Interface";

class VideoStatistic extends Model<
  VideoStatistic_Interface, VideoStatistic_CreationInterface
> implements VideoStatistic_Interface {
  public videoId!: string;
  public duration!: number;
  public viewCount!: number;
  public lastUpdatedViewCount!: Date;
  public likeCount!: number;
  public lastUpdatedLikeCount!: Date;
  public dislikeCount!: number;
  public lastUpdatedDislikeCount!: Date;
};

VideoStatistic.init({
  videoId: {
    type: DT.UUID,
    primaryKey: true,
    allowNull: false,
  },
  duration: {
    type: DT.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  viewCount: {
    type: DT.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  lastUpdatedViewCount: {
    type: DT.DATE,
    allowNull: false,
    defaultValue: DT.NOW,
  },
  likeCount: {
    type: DT.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  lastUpdatedLikeCount: {
    type: DT.DATE,
    allowNull: false,
    defaultValue: DT.NOW,
  },
  dislikeCount: {
    type: DT.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  lastUpdatedDislikeCount: {
    type: DT.DATE,
    allowNull: false,
    defaultValue: DT.NOW
  }
}, {
  sequelize,
  tableName: "VideoStatisTic",
  timestamps: true
});

export default VideoStatistic;