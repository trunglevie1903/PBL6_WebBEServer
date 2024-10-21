import { Optional } from "sequelize";

export interface VideoTranscript_Interface {
  transcriptId: string;
  videoId: string;
  timestamp: number;
  text: string;
}

export interface VideoTranscript_CreationInterface extends Optional<VideoTranscript_Interface, null>{};