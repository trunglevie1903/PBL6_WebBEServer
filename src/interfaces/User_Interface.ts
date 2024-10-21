import { Optional } from "sequelize";

export const UserRole = ['user', 'admin'] as const;

export interface User_Interface {
  userId: string;
  name: string;
  username: string;
  password_hash: string;
  email: string;
  role: typeof UserRole[number];
}

export interface User_CreationInterface extends Optional<
  User_Interface,
  "userId" | "role"
>{};
