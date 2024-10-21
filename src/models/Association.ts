import { sequelize } from "../config";

import User from "./User";
import UserProfile from "./UserProfile";
import UserAuthentication from "./UserAuthentication";
import Video from "./Video";
import VideoStatistic from "./VideoStatistic";
import UserLikeVideo from "./UserLikeVideo";
import Comment from "./Comment";
import VideoSummary from "./VideoSummary";

// UserProfile and UserAuthentication
User.hasOne(UserProfile, {
  sourceKey: "userId",
  foreignKey: "userId",
  onDelete: "CASCADE"
});
UserProfile.belongsTo(User, {
  targetKey: "userId",
  foreignKey: "userId"
});
User.hasOne(UserAuthentication, {
  sourceKey: "userId",
  foreignKey: "userId",
  onDelete: "CASCADE"
});
UserAuthentication.belongsTo(User, {
  targetKey: "userId",
  foreignKey: "userId"
});
User.afterCreate(async (user) => {
  await UserProfile.create({
    userId: user.userId
  });
  await UserAuthentication.create({
    userId: user.userId
  });
});
User.beforeDestroy(async (user) => {
  await UserProfile.destroy({
    where: {
      userId: user.userId
    }
  });
  await UserAuthentication.destroy({
    where: {
      userId: user.userId
    }
  });
});

// Video-User
User.hasMany(Video, {
  sourceKey: "userId",
  foreignKey: "creatorUserId",
  onDelete: "CASCADE"
});
Video.belongsTo(User, {
  targetKey: "userId",
  foreignKey: "creatorUserId",
});

// VideoStatistic
Video.hasOne(VideoStatistic, {
  sourceKey: "videoId",
  foreignKey: "videoId",
  onDelete: "CASCADE",
});
VideoStatistic.belongsTo(Video, {
  targetKey: "videoId",
  foreignKey: "videoId"
});
Video.hasOne(VideoSummary, {
  sourceKey: "videoId",
  foreignKey: "videoId",
  onDelete: "CASCADE"
});
VideoSummary.belongsTo(Video, {
  targetKey: "videoId",
  foreignKey: "videoId"
});
Video.afterCreate(async (video) => {
  await VideoStatistic.create({videoId: video.videoId});
  await VideoSummary.create({videoId: video.videoId});
});
Video.beforeDestroy(async (video) => {
  await VideoStatistic.destroy({
    where: {
      videoId: video.videoId
    }
  });
  await VideoSummary.destroy({
    where: {
      videoId: video.videoId
    }
  });
});

// UserLikeVideo
User.hasMany(UserLikeVideo, {
  sourceKey: "userId",
  foreignKey: "userId",
  onDelete: "CASCADE"
});
UserLikeVideo.belongsTo(User, {
  targetKey: "userId",
  foreignKey: "userId"
});
User.beforeDestroy(async (user) => {
  await UserLikeVideo.destroy({
    where: {userId: user.userId}
  })
});
Video.hasMany(UserLikeVideo, {
  sourceKey: "videoId",
  foreignKey: "videoId",
  onDelete: "CASCADE"
});
UserLikeVideo.belongsTo(Video, {
  targetKey: "videoId",
  foreignKey: "videoId"
});
Video.beforeDestroy(async (video) => {
  await UserLikeVideo.destroy({
    where: {
      videoId: video.videoId
    }
  });
});

User.hasMany(Comment, {
  sourceKey: "userId",
  foreignKey: "userId",
  onDelete: "CASCADE"
});
Comment.belongsTo(User, {
  targetKey: "userId",
  foreignKey: "userId"
});
Video.hasMany(Comment, {
  sourceKey: "videoId",
  foreignKey: "videoId",
  onDelete: "CASCADE"
});
Comment.belongsTo(Video, {
  targetKey: "videoId",
  foreignKey: "videoId"
});
User.beforeDestroy(async (user) => {
  await Comment.destroy({where: {userId: user.userId}});
});
Video.beforeDestroy(async (video) => {
  await Comment.destroy({where: {videoId: video.videoId}});
});
// Comment.hasMany(Comment, {
//   sourceKey: "commentId",
//   foreignKey: "parentCommentId",
//   onDelete: "CASCADE"
// });
// Comment.belongsTo(Comment, {
//   targetKey: "commentId",
//   foreignKey: "parentCommentId",
// });

const syncModels = async () => {
  try {
    // await User.sync();
    // await UserProfile.sync();
    // await UserAuthentication.sync();
    // await sequelize.sync({force: true});
    await sequelize.sync();
  } catch (error) {
    console.error(error);
  }
};

export default syncModels;