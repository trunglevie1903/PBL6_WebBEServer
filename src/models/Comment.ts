import { DataTypes as DT, Model } from "sequelize";

import { sequelize } from "../config";
import { Comment_Interface, Comment_CreationInterface } from "../interfaces/Comment_Interface";

class Comment extends Model<
  Comment_Interface, Comment_CreationInterface
> implements Comment_Interface {
  public commentId!: string;
  public videoId!: string;
  public userId!: string;
  public content!: string;
  public createdTime!: Date;
  public parentCommentId!: string | null;
};

Comment.init({
  commentId: {
    type: DT.UUID,
    primaryKey: true,
    defaultValue: DT.UUIDV4
  },
  videoId: {
    type: DT.UUID,
    allowNull: false,
  },
  userId: {
    type: DT.UUID,
    allowNull: false
  },
  content: {
    type: DT.STRING,
    allowNull: false,
  },
  createdTime: {
    type: DT.TIME,
    allowNull: false,
    defaultValue: DT.NOW
  },
  parentCommentId: {
    type: DT.UUID,
    allowNull: true,
    references: {
      model: Comment, // Self-referential foreign key
      key: 'commentId',
    },
    onDelete: "CASCADE"
  }
}, {
  sequelize,
  tableName: "Comment",
  timestamps: true
});

export default Comment;