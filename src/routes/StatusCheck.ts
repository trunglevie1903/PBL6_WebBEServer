import { Router, Request, Response, NextFunction } from "express";

const handleGetRequest = (
  req: Request, res: Response, next: NextFunction
) => {
  console.log("StatusCheck GET");
  res.status(200).json({ msg: "Hello from BE" });
};
const handlePostRequest = (
  req: Request, res: Response, next: NextFunction
) => {
  console.log({ ...req.body });
  res.status(200).json({});
}

const StatusCheck = Router();

StatusCheck.route("/")
  .get(handleGetRequest)
  .post(handlePostRequest);

export default StatusCheck;