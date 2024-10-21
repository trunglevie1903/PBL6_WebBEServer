// import { DataTypes as DT, Model, Optional } from 'sequelize';
// import { sequelize } from '../config';

// const UserRole = ["user", "admin"] as const;

// interface UserInterface {
//   user_id: string;
//   name: string;
//   username: string;
//   password_hash: string;
//   email: string;
//   description: string;
//   role: typeof UserRole[number];
//   login_attempts: number;
//   is_locked: boolean;
//   unlock_timestamp: Date | null;
//   last_login: Date | null;
//   refresh_token: string | null;
//   banner_img: Buffer | null;
//   avatar_img: Buffer | null;
// }

// interface UserCreationInterface extends Optional<
//   UserInterface,
//   "user_id" | "role" | "description" | "login_attempts" | "is_locked" | "unlock_timestamp" | "last_login" | "refresh_token" | "banner_img" | "avatar_img"
// >{};

// class User extends Model <
//   UserInterface, UserCreationInterface
// > implements UserInterface {
//   public user_id!: string;
//   public name!: string;
//   public username!: string;
//   public email!: string;
//   public description!: string | null;
//   public password_hash!: string;
//   public role!: typeof UserRole[number];
//   public last_login!: Date | null;
//   public login_attempts!: number;
//   public is_locked!: boolean;
//   public unlock_timestamp!: Date | null;
//   public refresh_token!: string | null;
//   public banner_img!: Buffer | null;
//   public avatar_img!: Buffer | null;
// };

// User.init({
//   user_id: {
//     type: DT.UUID,
//     defaultValue: DT.UUIDV4,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: {
//     type: DT.STRING,
//     allowNull: false,
//     defaultValue: "Name"
//   },
//   username: {
//     type: DT.STRING,
//     allowNull: false,
//     unique: true
//   },
//   email: {
//     type: DT.STRING,
//     allowNull: false
//   },
//   description: {
//     type: DT.STRING,
//     allowNull: true
//   },
//   password_hash: {
//     type: DT.STRING,
//     allowNull: false
//   },
//   role: {
//     type: DT.ENUM(...UserRole),
//     defaultValue: "user",
//     allowNull: false
//   },
//   last_login: {
//     type: DT.DATE,
//     allowNull: true
//   },
//   login_attempts: {
//     type: DT.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   },
//   is_locked: {
//     type: DT.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   },
//   unlock_timestamp: {
//     type: DT.DATE,
//     allowNull: true
//   },
//   refresh_token: {
//     type: DT.STRING,
//     allowNull: true
//   },
//   banner_img: {
//     type: DT.BLOB('long'),
//     allowNull: true
//   },
//   avatar_img: {
//     type: DT.BLOB('long'),
//     allowNull: true
//   }
// }, {
//   sequelize,
//   tableName: "User",
//   timestamps: true
// });

// export default User;