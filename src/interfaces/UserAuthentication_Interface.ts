import { Optional } from "sequelize";

export interface UserAuthentication_Interface {
  userId: string;
  loginAttempt: number;
  isLocked: boolean;
  unlockTimestamp: Date | null;
  lastLogin: Date | null;
  refreshToken: string | null;
}

export interface UserAuthentication_CreationInterface extends Optional<
  UserAuthentication_Interface,
  "userId" | "loginAttempt" | "isLocked" | "unlockTimestamp" | "lastLogin" | "refreshToken"
>{};