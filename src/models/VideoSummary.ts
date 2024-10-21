import { DataTypes as DT, Model, Sequelize } from "sequelize";

import { sequelize } from "../config";
import { VideoSummary_Interface, VideoSummary_CreationInterface } from "../interfaces/VideoSummary_Interface";


class VideoSummary extends Model<
  VideoSummary_Interface, VideoSummary_CreationInterface
> implements VideoSummary_Interface {
  public videoId!: string;
  public summary!: string | null;
};

VideoSummary.init({
  videoId: {
    type: DT.UUID,
    primaryKey: true,
  },
  summary: {
    type: DT.STRING,
    allowNull: true,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: "VideoSummary"
});

export default VideoSummary;