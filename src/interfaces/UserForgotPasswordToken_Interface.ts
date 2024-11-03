import { Optional } from "sequelize";

export interface PasswordResetRequest {
  username: string;
  email: string;
}

export interface PasswordResetToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface NewPasswordRequest {
  token: string;
  newPassword: string;
}
