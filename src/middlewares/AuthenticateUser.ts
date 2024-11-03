import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { config } from "../config";
import UserService from "../services/UserService";

interface AuthenticateRequestInterface extends Request {
  user?: { username: string, role: string };
}

const AuthenticateUser = async (
  req: AuthenticateRequestInterface,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token found, please login" });

  try {
    const secret = config.jwtSecret || "mysecretkey";
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'object' && 'username' in decoded && 'role' in decoded) {
      const { username, role } = decoded as JwtPayload;

      // find any user with matching username and role
      const isAuthenticated = await UserService.authenticateAccount(username, role);
      if (isAuthenticated) {
        req.user = { ...req.user, username, role };
        next();
      } else throw new Error("Invalid credentials");
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Token expired, please login again" });
    } else {
      return res.status(403).json({ message: "Authentication error", error: err.message });
    }
  }
};

export default AuthenticateUser;