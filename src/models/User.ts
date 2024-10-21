import { DataTypes as DT, Model, Optional } from "sequelize";
import { sequelize } from "../config";
import { User_CreationInterface, User_Interface, UserRole } from "../interfaces/User_Interface";

class User extends Model<
  User_Interface, User_CreationInterface
> implements User_Interface {
  public userId!: string;
  public name!: string;
  public username!: string;
  public password_hash!: string;
  public email!: string;
  public role!: typeof UserRole[number];
}

User.init({
  userId: {
    type: DT.UUID,
    primaryKey: true,
    defaultValue: DT.UUIDV4
  },
  role: {
    type: DT.ENUM(...UserRole),
    defaultValue: "user"
  },
  name: {
    type: DT.STRING,
    allowNull: false
  },
  username: {
    type: DT.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DT.STRING,
    allowNull: false
  },
  email: {
    type: DT.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: "User",
  timestamps: true
});

export default User;