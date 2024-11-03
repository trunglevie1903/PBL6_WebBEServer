// models/PasswordResetToken.model.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config";
import { PasswordResetToken } from '../interfaces/UserForgotPasswordToken_Interface';

class PasswordResetTokenModel extends Model<PasswordResetToken> implements PasswordResetToken {
  public userId!: string;
  public token!: string;
  public expiresAt!: Date;
}

PasswordResetTokenModel.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PasswordResetToken',
    tableName: 'password_reset_tokens',
    timestamps: false,
  }
);

export default PasswordResetTokenModel;
