import { Router } from "express";

import VideoController from "../controllers/VideoController";
import AuthenticateUser from "../middlewares/AuthenticateUser";

const VideoRouter = Router();

VideoRouter.route("/upload-video").post(AuthenticateUser, VideoController.uploadVideo);
VideoRouter.route("/latest-ids").get(VideoController.getLatestVideoIds);
VideoRouter.route("/visual-data/:videoId").get(VideoController.getVideoCardInfo);
VideoRouter.route("/get-video-stream/:videoId").get(VideoController.streamVideo);
VideoRouter.route("/get-video-detail/:videoId").get(VideoController.getVideoDetail);
VideoRouter.route("/get-10-other-videos/:videoId").get(VideoController.get10OtherVideos);
VideoRouter.route("/:videoId").get(VideoController.findVideoById);
VideoRouter.route("/delete-video/:videoId").post(VideoController.deleteVideo);
VideoRouter.route("/update-transcript/").post(VideoController.updateVideoTranscript);
VideoRouter.route("/update-summary/").post(VideoController.updateVideoSummary);
VideoRouter.route("/get-transcript/:videoId").get(VideoController.getVideoTranscript);
VideoRouter.route("/get-summary/:videoId").get(VideoController.getVideoSummary);
VideoRouter.route("/of-user/:userId").get(VideoController.findVideoIdsByCreatorUserId);
VideoRouter.route("/created-count-of-user/:userId").get(VideoController.findVideoCountByCreatorUserId);

export default VideoRouter;