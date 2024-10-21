import { DataTypes as DT, Model } from "sequelize";
import { sequelize } from "../config";
import { UserAuthentication_CreationInterface, UserAuthentication_Interface } from "../interfaces/UserAuthentication_Interface";

class UserAuthentication extends Model<
  UserAuthentication_Interface, UserAuthentication_CreationInterface
> implements UserAuthentication_Interface {
  public userId!: string;
  public loginAttempt!: number;
  public isLocked!: boolean;
  public unlockTimestamp!: Date | null;
  public lastLogin!: Date | null;
  public refreshToken!: string | null;
};

UserAuthentication.init({
  userId: {
    type: DT.UUID,
    primaryKey: true
  },
  loginAttempt: {
    type: DT.INTEGER.UNSIGNED,
    defaultValue: 0
  },
  isLocked: {
    type: DT.BOOLEAN,
    defaultValue: false
  },
  unlockTimestamp: {
    type: DT.DATE,
    allowNull: true,
    defaultValue: null
  },
  lastLogin: {
    type: DT.DATE,
    allowNull: true,
    defaultValue: null,
  },
  refreshToken: {
    type: DT.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize,
  tableName: "UserAuthentication"
});

export default UserAuthentication;