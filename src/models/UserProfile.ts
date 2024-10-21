import { DataTypes as DT, Model } from "sequelize";
import { sequelize } from "../config";
import { UserProfile_CreationInterface, UserProfile_Interface } from "../interfaces/UserProfile_Interface";

class UserProfile extends Model<
  UserProfile_Interface, UserProfile_CreationInterface
> implements UserProfile_Interface {
  public userId!: string;
  public bannerImage!: string;
  public avatarImage!: string;
  public description!: string;
};

UserProfile.init({
  userId: {
    type: DT.UUID,
    primaryKey: true
  },
  bannerImage: {
    type: DT.STRING,
    allowNull: true
  },
  avatarImage: {
    type: DT.STRING,
    allowNull: true
  },
  description: {
    type: DT.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: "UserProfile"
});

export default UserProfile;