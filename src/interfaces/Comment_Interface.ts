import { Optional } from "sequelize";

export interface Comment_Interface {
  commentId: string;
  videoId: string;
  userId: string;
  content: string;
  createdTime: Date;
  parentCommentId: string | null;
}

export interface Comment_CreationInterface extends Optional<
  Comment_Interface, "commentId" | "createdTime"
>{};