import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { config } from "../config";
import UserService from "../services/UserService";

interface AuthenticateRequestInterface extends Request {
  user?: { username: string, role: string };
}

const AuthenticateUser = async (
  req: AuthenticateRequestInterface,
  res: Response, next: NextFunction
) => {
  // console.log(`[AuthMid] header: ${req.header("Authorization")}`);
  const token = req.header("Authorization")?.split(" ")[1];
  // console.log(`[AuthMid] token: ${token}`);
  if (!token) return res.status(401).json({ message: "No token found, please login"});

  try {
    const secret = config.jwtSecret || "mysecretkey";
    // console.log('secret: ', secret);
    const decoded = jwt.verify(token, secret);
    // console.log('decoded: ', decoded);
    if (typeof decoded === 'object' && 'username' in decoded && 'role' in decoded) {
      const { username, role } = decoded as JwtPayload;
      // console.log("username and role: ", username, role);
      const isAuthenticated = await UserService.authenticateAccount(username, role);
      // console.log('is authenticated? ', isAuthenticated);
      if (isAuthenticated) {
        req.user = { ...req.user, username, role };
        next();
      } 
      else throw new Error("Invalid credential");
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res.status(403).json({ message: "Unexpected error", error: (err instanceof Error) ? err.message : err });
  }
};

export default AuthenticateUser;