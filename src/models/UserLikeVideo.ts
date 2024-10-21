import { DataTypes as DT, Model } from "sequelize";

import { sequelize } from "../config";
import { LikeStatus, UserLikeVideo_Interface, UserLikeVideo_CreationInterface } from "../interfaces/UserLikeVideo_Interface";

class UserLikeVideo extends Model<
  UserLikeVideo_Interface, UserLikeVideo_CreationInterface
> implements UserLikeVideo_Interface {
  public userId!: string;
  public videoId!: string;
  public likeStatus!: typeof LikeStatus[number];
};

UserLikeVideo.init({
  userId: {
    type: DT.UUID,
    allowNull: false,
    primaryKey: true
  },
  videoId: {
    type: DT.UUID,
    allowNull: false,
    primaryKey: true
  },
  likeStatus: {
    type: DT.ENUM(...LikeStatus),
    allowNull: false
  }
}, {
  sequelize,
  tableName: "user_like_video",
  timestamps: true
});

export default UserLikeVideo;