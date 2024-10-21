import { DataTypes as DT, Model } from "sequelize";

import { sequelize } from "../config";
import { VideoTranscript_Interface, VideoTranscript_CreationInterface } from "../interfaces/VideoTranscript_Interface";

class VideoTranscript extends Model<
  VideoTranscript_Interface, VideoTranscript_CreationInterface
> implements VideoTranscript_Interface {
  public transcriptId!: string;
  public videoId!: string;
  public text!: string;
  public timestamp!: number;
};

VideoTranscript.init({
  transcriptId: {
    type: DT.UUID,
    defaultValue: DT.UUIDV4,
    primaryKey: true,
  },
  videoId: {
    type: DT.UUID,
    allowNull: false
  },
  text: {
    type: DT.TEXT('long'),
    allowNull: false
  },
  timestamp: {
    type: DT.INTEGER.UNSIGNED,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: "VideoTranscript",
  timestamps: true
});

export default VideoTranscript;