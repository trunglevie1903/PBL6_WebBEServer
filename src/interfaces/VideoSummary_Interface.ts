import { Optional } from "sequelize";
export interface VideoSummary_Interface {
  videoId: string;
  summary: string | null;
}
export interface VideoSummary_CreationInterface extends Optional<
  VideoSummary_Interface,
  "summary"
>{};