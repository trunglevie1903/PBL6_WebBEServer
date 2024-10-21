import { Optional } from "sequelize";

export const VideoPrivacy = ["public", "private", "unlisted"] as const;
export const VideoStatus = ["published", "draft", "removed"] as const;

export interface Video_Interface {
  videoId: string;
  creatorUserId: string;
  title: string;
  description: string;
  videoPath: string;
  thumbnailPath: string;
  privacy: typeof VideoPrivacy[number];
  status: typeof VideoStatus[number];
  uploadDate: Date;
}
export interface Video_CreationInterface extends Optional<
  Video_Interface,
  "uploadDate" | "status"
>{};