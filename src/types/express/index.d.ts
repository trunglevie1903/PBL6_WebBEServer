declare namespace Express {
  interface Request {
    user?: {
      username?: string;
      role?: string;
    };
    file?: any;
  }
}