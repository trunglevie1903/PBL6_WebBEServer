import { Request, Response, NextFunction } from "express";

const RequestLogging = (
  req: Request, res: Response, next: NextFunction
) => {
  console.log(`[REQUEST] URL: ${req.url} - METHOD: ${req.method} - BODY: ${new Object(req.body).toString()}`);
  res.on("finish", () => {
    console.log(`[RESPONSE] URL: ${req.url} - METHOD: ${req.method} - STATUS: ${res.statusCode}`);
  });
  next();
};

export default RequestLogging;