import { DataTypes as DT, Model } from "sequelize";

import { Video_CreationInterface, Video_Interface, VideoPrivacy, VideoStatus } from "../interfaces/Video_Interface";
import { sequelize } from "../config";

class Video extends Model<
  Video_Interface, Video_CreationInterface
> implements Video_Interface {
  public videoId!: string;
  public creatorUserId!: string;
  public title!: string;
  public description!: string | null;
  public videoPath!: string;
  public thumbnailPath!: string;
  public privacy!: typeof VideoPrivacy[number];
  public status!: typeof VideoStatus[number];
  public uploadDate!: Date;
};

Video.init({
  videoId: {
    type: DT.UUID,
    primaryKey: true,
    defaultValue: DT.UUIDV4
  },
  creatorUserId: {
    type: DT.UUID,
    allowNull: false
  },
  title: {
    type: DT.STRING,
    allowNull: false,
  },
  description: {
    type: DT.STRING,
    allowNull: true
  },
  videoPath: {
    type: DT.STRING,
    allowNull: true,
  },
  thumbnailPath: {
    type: DT.STRING,
    allowNull: true
  },
  privacy: {
    type: DT.ENUM(...VideoPrivacy),
    defaultValue: "public"
  },
  status: {
    type: DT.ENUM(...VideoStatus),
    defaultValue: "draft"
  },
  uploadDate: {
    type: DT.DATE,
    defaultValue: DT.NOW
  }
}, {
  sequelize,
  tableName: "Video",
  timestamps: true
});

export default Video;