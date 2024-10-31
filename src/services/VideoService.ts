import { Op } from "sequelize";
import {v4 as uuidv4} from 'uuid';

import Video from "../models/Video";
import VideoDetailInterface from "../interfaces/VideoDetail_Interface";
import VideoSummary from "../models/VideoSummary";
import VideoTranscript from "../models/VideoTranscript";
import UserService from "./UserService";

class VideoService {
  static generateValidVideoId = async () => {
    let id = uuidv4();
    let video = await Video.findByPk(id);
    while (video) {
      id = uuidv4();
      video = await Video.findByPk(id);
    }
    return id;
  };

  static createVideo = async (videoData: {
    videoId: string,
    creatorUserId: string,
    title: string,
    description: string | null,
    privacy: string,
    thumbnailPath: string,
    videoPath: string
  }) => {
    const filteredVideoData = Object.entries(videoData)
      .filter(([key, value]) => value !== null)  // Keep only entries where the value is not null
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    const video = await Video.create(filteredVideoData);
    if (!video.videoId || video instanceof Error) {
      console.error("Error on creating video: ", video);
      return null;
    } else return video;
  };

  static findVideoById = async (videoId: string) => {
    // console.log("videoId: ", videoId);
    const video = await Video.findByPk(videoId);
    if (!video || !video.videoId || video instanceof Error) {
      console.error("Error on fetching video data: ", video);
      return null;
    }
    else return video;
  };

  static get10LatestVideo = async () => {
    const videos = await Video.findAll({
      limit: 10,
      order: [
        ["uploadDate", "DESC"]
      ]
    });
    return videos;
  };

  static get10OtherVideos = async (videoId) => {
    const videos = await Video.findAll({
      limit: 10,
      where: {
        videoId: {
          [Op.ne]: videoId
        }
      },
      order: [
        ["uploadDate", "DESC"]
      ]
    });
    const data: string[] = videos.map(item => item.videoId);
    return data;
  };

  static getVideoDetail = async (videoId: string) => {
    try {
      if (!videoId) throw new Error("Invalid video key");
      
      const video = await Video.findByPk(videoId);
      if (!video) throw new Error("Video not found");
      if (video instanceof Error) throw video;

      const returnData: VideoDetailInterface = {
        title: video.title,
        description: video.description,
        creatorUserId: video.creatorUserId,
        uploadDate: video.uploadDate,
        transcript: "Generating...",
        summary: "Generating..."
      };
      return returnData;
    } catch (error) {
      return new Error(error instanceof Error? error.message : error);
    }
  };

  static deleteVideo = async (videoId: string) => {
    try {
      if (!videoId) throw new Error("Invalid video key");
      const video = await VideoService.findVideoById(videoId);
      if (!video) throw new Error("Video not found");
      if (video instanceof Error) throw video;
      await video.destroy();
      return {};
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static getVideoSummary = async (videoId: string) => {
    try {
      if (!videoId) throw new Error("Invalid video key");
      const summary = await VideoSummary.findByPk(videoId);
      if (!summary) throw new Error("Video not found");
      if (summary instanceof Error) throw summary;
      return summary;
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  }

  static updateVideoSummary = async (videoId: string, summary: string) => {
    try {
      if (!videoId) throw new Error("Invalid video key");
      const videoSummary = await VideoSummary.findByPk(videoId);
      if (!videoSummary) throw new Error("Video not found");
      if (videoSummary instanceof Error) throw videoSummary;
      videoSummary.summary = summary;
      await videoSummary.save();
      return {};
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static getVideoTranscript = async (videoId: string) => {
    try {
      if (!videoId) throw new Error("Invalid video key");
      const video = await Video.findByPk(videoId);
      if (!video) throw new Error("Video not found");
      if (video instanceof Error) throw video;
      const transcripts = await VideoTranscript.findAll({where: {videoId: video.videoId}, order: [["timestamp", "ASC"]]});
      if (transcripts instanceof Error) throw transcripts;
      else return transcripts;
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static createVideoTranscriptChunk = async (videoId: string, text: string, timestamp: number) => {
    try {
      if (!videoId) throw new Error("Invalid video key");
      const video = await Video.findByPk(videoId);
      if (!video) throw new Error("Video not found");
      if (video instanceof Error) throw video;

      const transcriptChunk = await VideoTranscript.create({videoId, text, timestamp});
      if (transcriptChunk instanceof Error) throw transcriptChunk;
      else return transcriptChunk;

    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static deleteVideoTranscript = async (videoId: string) => {
    try {
      if (!videoId) throw new Error("Invalid video key");
      const video = await Video.findByPk(videoId);
      if (!video) throw new Error("Video not found");
      if (video instanceof Error) throw video;

      const result = await VideoTranscript.destroy({where: {videoId}});
      return result;
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static findVideoByCreatorUserId = async (userId: string) => {
    try {
      if (!userId) throw new Error("Invalid user key");
      const user = await UserService.findByPk(userId);
      if (user instanceof Error) throw user;

      const videos = await Video.findAll({
        where: {
          creatorUserId: {
            [Op.eq]: user.userId
          }
        },
        order: [
          ["uploadDate", "DESC"]
        ],
        limit: 100
      });
      if (videos instanceof Error) throw videos;
      else return videos.map(item => item.videoId);
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };

  static findVideoCountByCreatorUserId = async (userId: string) => {
    try {
      if (!userId) throw new Error("Invalid user key");
      const user = await UserService.findByPk(userId);
      if (user instanceof Error) throw user;

      const count = await Video.count({
        where: {
          creatorUserId: {
            [Op.eq]: user.userId
          }
        }
      });
      return count;
    } catch (error) {
      return new Error(error instanceof Error ? error.message : error);
    }
  };
}

export default VideoService;