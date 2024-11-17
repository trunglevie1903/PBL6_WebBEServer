import { Request, Response } from "express";
import multer from "multer";
import ffmpeg from 'fluent-ffmpeg';
import fs from "fs";
import path from "path";
import VideoService from "../services/VideoService";
import UserService from "../services/UserService";
import FormData from 'form-data';
import axios from 'axios';

// Helper Functions
const extractVideoId = (filePath: string): string => {
  const filename = path.basename(filePath);
  return path.parse(filename).name;  // Extract ID without extension
};

const generateThumbnail = async (videoPath: string, videoId: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => {
        console.log("Thumbnail generated");
        resolve(path.join('uploads/thumbnails', `${videoId}.png`));
      })
      .on('error', (error) => {
        console.error("Error generating thumbnail:", error);
        reject(new Error(error instanceof Error ? error.message : error));
      })
      .screenshots({
        timestamps: ["50%"],
        filename: `${videoId}.png`,
        folder: "uploads/thumbnails",
        size: "1280x720"
      });
  });
};

const readImageAsString = async (imagePath: string): Promise<string | Error> => {
  try {
    const imageData = await fs.promises.readFile(imagePath);
    const base64Image = imageData.toString('base64');
    const ext = path.extname(imagePath).substring(1);
    return `data:image/${ext};base64,${base64Image}`;
  } catch (error) {
    console.error("Error: ", error);
    return new Error(error instanceof Error ? error.message : error);
  }
};

const findUser = async (username: string) => {
  const user = await UserService.findByUsername(username);
  return user instanceof Error || user === null ? null : user;
};

const extractAudio = (videoFilePath: string, audioFilePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoFilePath)
      .output(audioFilePath)
      .noVideo()
      .audioCodec("libmp3lame")
      .on('end', () => {
        console.log(`Audio is extracted to ${audioFilePath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error: ${err}`);
        reject(err)
      })
      .run();
  });
};

const sendAudioToAIS = async (videoId: string, audioFilePath: string) => {
  const form: FormData = new FormData();
  form.append("videoId", videoId);
  form.append('file', fs.createReadStream(audioFilePath));
  try {
    const response = await axios.post("http://localhost:5000/summarize", form, {
      headers: {...form.getHeaders(),}
    })
    console.log(`Response from AIS: ${response.data}`);
  } catch (error) {
    console.error(`Failed to send audio file to AIS: ${error}`);
  }
};

const streamVideoChunk = (videoPath: string, req: Request, res: Response) => {
  try {
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video not found.');
    }

    const stat = fs.statSync(videoPath);
    const total = stat.size;
    const range = req.headers.range;

    if (!range) {
      return res.status(400).send('Requires Range header');
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
    const chunkSize = (end - start) + 1;

    // Ensure the correct MIME type for the video
    const ext = path.extname(videoPath);
    const mimeType = ext === '.mp4' ? 'video/mp4' : 'video/webm';

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType,  // Dynamically set MIME type
    };

    res.writeHead(206, headers);

    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);
  } catch (error) {
    console.error("Error on streaming: ", error instanceof Error ? error.message : error);
    return res.status(500).json({message: `Server error - streaming error: ${error instanceof Error ? error.message : error}`})
  }
};

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: async (req, file, cb) => {
    const videoId = await VideoService.generateValidVideoId();
    cb(null, `${videoId}.mp4`);
  }
});

const uploadVideoToStorage = multer({ storage }).single("videoFile");

export default class VideoController {

  static uploadVideo = async (req: Request, res: Response) => {
    uploadVideoToStorage(req, res, async (err) => {
      if (err) return res.status(500).json({ message: "Error uploading video" });

      const videoFilePath = req.file?.path as string;
      if (!videoFilePath) return res.status(400).json({ message: "No video file provided" });

      try {
        const videoId = extractVideoId(videoFilePath);
        console.log(videoId);
        await generateThumbnail(videoFilePath, videoId);
        const thumbnailPath = path.join("uploads/thumbnails", `${videoId}.png`);
        const audioFilePath = path.join(`uploads/audios/${videoId}.mp3`);
        if (!fs.existsSync(path.join('uploads/audios'))) {
          fs.mkdirSync(path.join('uploads/audios'), { recursive: true });
        }
        // await extractAudio(videoFilePath, audioFilePath);
        // await sendAudioToAIS(videoId, audioFilePath);

        const user = await findUser(req.user.username);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { title, description, privacyStatus } = req.body;
        console.log('videoId:', videoId);
        console.log("creatorUserId:", user.userId);
        console.log('title:', title);
        console.log("description:", description);
        console.log("privacy:", privacyStatus);
        console.log("videoPath:", videoFilePath);
        console.log("thumbnailPath: ", thumbnailPath);

        // Save video metadata to the database here...
        const video = await VideoService.createVideo({
          videoId,
          creatorUserId: user.userId,
          title,
          description,
          videoPath: videoFilePath,
          thumbnailPath,
          privacy: privacyStatus
        });
        if (!video) throw new Error("Error on creating videos");
        else {
          return res.status(201).json({ 
            message: "Video uploaded successfully", 
            data: {
              videoId: video.videoId,
              creatorUserId: video.creatorUserId,
              title: video.title,
              description: video.description,
              videoPath: video.videoPath,  
              thumbnailPath: video.thumbnailPath,
              privacy: video.privacy,
            } 
          });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
      }
    });
  };

  static getVideoCardInfo = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Video key is empty");
      
      const video = await VideoService.findVideoById(videoId);
      if (!video) throw new Error("Video not found");

      const thumbnailImageAsString = await readImageAsString(video.thumbnailPath);

      const returnData = {
        videoId: video.videoId,
        title: video.title,
        // description: video.description,
        thumbnail: thumbnailImageAsString,
      };
      return res.status(200).json({returnData});
    } catch (error) {
      console.error("Error: ", error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static streamVideo = async (req: Request, res: Response) => {
    try {
      const { videoId } = req.params;
      if (!videoId) throw new Error("Video key is empty");

      const video = await VideoService.findVideoById(videoId);
      if (!video) throw new Error("Video not found");

      const videoPath = video.videoPath;
      streamVideoChunk(videoPath, req, res);
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static getLatestVideoIds = async (req: Request, res: Response) => {
    try {
      const videos = await VideoService.get10LatestVideo();
      const ids: string[] = videos.map((val) => val.videoId);
      return res.status(200).json({ids});
    } catch (error) {
      console.error("Error: ", error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static getVideoDetail = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");
      else {
        const video = await VideoService.getVideoDetail(videoId);
        return res.status(200).json({video});
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static get10OtherVideos = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");
      else {
        const videoIds = await VideoService.get10OtherVideos(videoId);
        return res.status(200).json(videoIds);
      }
    } catch (error) {
      console.error(error) ;
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static findVideoById = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");
      else {
        let video = await VideoService.findVideoById(videoId);
        if (!video) throw new Error("Video not found");
        else if (video instanceof Error) throw video;
        else {
          let thumbnail = await readImageAsString(video.thumbnailPath);
          return res.status(200).json({thumbnail: (thumbnail instanceof Error) ? null : thumbnail, video});
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: `Error: ${error instanceof Error ? error.message : error}`});
    }
  };

  static deleteVideo = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");
      const result = await VideoService.deleteVideo(videoId);
      if (result instanceof Error) throw result;
      else return res.status(200).json({message: `Video deleted`});
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.status(400).json({message: `Server error: ${error}`});
    }
  };

  static getVideoSummary = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");
      const result = await VideoService.getVideoSummary(videoId);
      if (result instanceof Error) throw result;
      else res.status(200).json({summary: result});
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.status(400).json({message: `Server error: ${error}`});
    }
  };

  static updateVideoSummary = async (req: Request, res: Response) => {
    try {
      const {videoId, summary} = req.body;
      console.log('summary: ', summary);
      if (!videoId) throw new Error ("Invalid video key");
      const result = await VideoService.updateVideoSummary(videoId, summary);
      if (result instanceof Error) throw result;
      else return res.status(200).json({message: "Updated"});
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.status(400).json({message: `Server error: ${error}`});
    }
  };

  static getVideoTranscript = async (req: Request, res: Response) => {
    try {
      const {videoId} = req.params;
      if (!videoId) throw new Error("Invalid video key");
      const transcripts = await VideoService.getVideoTranscript(videoId);
      if (transcripts instanceof Error) throw transcripts;
      else return res.status(200).json({transcripts: transcripts});
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.status(400).json({message: `Server error: ${error}`});
    }
  };

  static updateVideoTranscript = async (req: Request, res: Response) => {
    try {
      // console.log(req.body.videoId, req.body.transcript);
      // const videoId = req.body.videoId as string; 
      // const transcript = req.body.transcript as {timestamp: string, text: string}[];
      const {videoId, transcript} = req.body;
      if (!videoId) throw new Error("Invalid video key");
      const result = await VideoService.deleteVideoTranscript(videoId);
      if (result instanceof Error) throw result;
      transcript.forEach(async (item) => {
        console.log(item);
        const result = await VideoService.createVideoTranscriptChunk(videoId, item.text, parseInt(item.timestamp));
        if (result instanceof Error) throw result;
      });
      return res.status(200).json({message: "OK"});
    } catch (error) {
      console.error(`Error: ${error}`); 
      return res.status(400).json({message: `Server error: ${error}`});
    }
  };

  static findVideoIdsByCreatorUserId = async (req: Request, res: Response) => {
    try {
      const {userId} = req.params;
      if (!userId) throw new Error("Invalid user key");

      const videoIds = await VideoService.findVideoByCreatorUserId(userId);
      if (videoIds instanceof Error) throw videoIds;

      return res.status(200).json(videoIds);
    } catch (error) {
      console.error(`Error: ${error}`); 
      return res.status(400).json({message: `Server error: ${error}`});
    }
  };

  static findVideoCountByCreatorUserId = async (req: Request, res: Response) => {
    try {
      const {userId} = req.params;
      if (!userId) throw new Error("Invalid user key");

      const videoCount = await VideoService.findVideoCountByCreatorUserId(userId);
      if (videoCount instanceof Error) throw videoCount;

      else res.status(200).json(videoCount);
    } catch (error) {
      console.error(`Error: ${error}`); 
      return res.status(400).json({message: `Server error: ${error}`});
    }
  };

  static searchVideo = async (req: Request, res: Response) => {
    try {
      const {searchText} = req.params;
      if (!searchText) throw new Error("Invalid search value");

      const ids = await VideoService.searchVideo(searchText);
      return res.status(200).json({videoIds: ids instanceof Error ? [] : ids});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message : error instanceof Error ? error.message : error});
    }
  };
}
