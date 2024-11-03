import crypto from 'crypto';
import bcrypt from 'bcrypt';

import User from '../models/User';
import PasswordResetTokenModel from '../models/PasswordResetToken';
import { PasswordResetRequest, PasswordResetToken, NewPasswordRequest } from '../interfaces/UserForgotPasswordToken_Interface';
import sendResetPasswordEmail from '../others/sendMail';

class ForgotPasswordService {
  // Step 1: Request Password Reset
  static async requestPasswordReset({ username, email }: PasswordResetRequest): Promise<string> {
    const user = await User.findOne({ where: { username, email } });
    if (!user) throw new Error("User not found");

    // Generate token and expiry date
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

    // Save token in DB
    await PasswordResetTokenModel.upsert({
      userId: user.userId,
      token,
      expiresAt,
    });

    // Here, an email service would send the reset link to the user's email
    const mailSubject = `ALERT: Reset Password`
    const mailHTML = `
      <p>We recently received a request to reset the password of your account.</p>
      <p>If you requested this, please use the link below to complete the action:</p>
      <p><a href="http://localhost:5173/reset-password">Click here to reset your password</a></p>
      <p>Also, your token is: <strong>${token}</strong></p>
      <br />
      <p>Regards,</p>
      <p>Dev team</p>
    `;
    await sendResetPasswordEmail(user.email, mailSubject, mailHTML);
    return token; // For testing purposes; ideally, return nothing.
  }

  // Step 2: Validate Token and Reset Password
  static async resetPassword({ token, newPassword }: NewPasswordRequest): Promise<void> {
    const passwordResetToken = await PasswordResetTokenModel.findOne({ where: { token } });
    if (!passwordResetToken || new Date() > passwordResetToken.expiresAt) {
      throw new Error("Invalid or expired token");
    }

    // Fetch user and update password
    const user = await User.findByPk(passwordResetToken.userId);
    if (!user) throw new Error("User not found");

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Invalidate token
    await passwordResetToken.destroy();
  }
}

export default ForgotPasswordService;