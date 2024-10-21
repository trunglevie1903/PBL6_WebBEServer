import { Optional } from "sequelize";

export interface Comment_Interface {
  commentId: string;
  userId: string;
  videoId: string;
  parentCommentId: string | null;
  content: string;
}

export interface Comment_CreationInterface extends Optional<
  Comment_Interface, "commentId"
>{};