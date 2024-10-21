import { DataTypes as DT, Model } from "sequelize";

import { sequelize } from "../config";
import { Comment_Interface, Comment_CreationInterface } from "../interfaces/Comment_Interface";

class Comment extends Model<
  Comment_Interface, Comment_CreationInterface
> implements Comment_Interface {
  public commentId!: string;
  public userId!: string;
  public videoId!: string;
  public parentCommentId!: string | null;
  public content!: string;
};

Comment.init({
  commentId: {
    type: DT.UUID,
    defaultValue: DT.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DT.UUID,
    allowNull: false,
  },
  videoId: {
    type: DT.UUID,
    allowNull: false,
  },
  parentCommentId: {
    type: DT.STRING,
    allowNull: true,
  },
  content: {
    type: DT.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "Comment",
  timestamps: true
});

export default Comment;