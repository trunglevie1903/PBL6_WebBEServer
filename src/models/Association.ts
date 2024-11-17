import { sequelize } from "../config";

import User from "./User";
import UserProfile from "./UserProfile";
import UserAuthentication from "./UserAuthentication";
import Video from "./Video";
import VideoStatistic from "./VideoStatistic";
import UserLikeVideo from "./UserLikeVideo";
import Comment from "./Comment";
import VideoSummary from "./VideoSummary";
import UserService from "../services/UserService";
import PasswordResetTokenModel from "./PasswordResetToken";

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

User.hasOne(PasswordResetTokenModel, {
  sourceKey: "userId",
  foreignKey: "userId",
  onDelete: "CASCADE"
});
PasswordResetTokenModel.belongsTo(User, {
  targetKey: "userId",
  foreignKey: "userId",
})
User.beforeDestroy(async (user) => {
  await PasswordResetTokenModel.destroy({
    where: {userId: user.userId}
  });
});



const pushInitialData = async () => {
  try {
    const adminUser = await UserService.registerUser("Admin", "admin", "leviettrung477@gmail.com", "admin");
    if (adminUser instanceof Error) throw adminUser;
    adminUser.role = "admin";
    await adminUser.save();

    const normUser = await UserService.registerUser("User", "user", "leviettrung477@gmail.com", "user");
    if (normUser instanceof Error) throw normUser;
    normUser.role = "user";
    await normUser.save();

    const normUser2 = await UserService.registerUser("User2", "user2", "leviettrung477@gmail.com", "user2");
    if (normUser2 instanceof Error) throw normUser2;
    normUser2.role = "user";
    await normUser2.save();

    console.log('Data initiation completed');
  } catch (error) {
    console.error(`Data initiation failed: ${error}`);
  }
};

const syncModels = async () => {
  try {
    // await sequelize.sync({force: true});
    // await pushInitialData();
    await sequelize.sync();
  } catch (error) {
    console.error(error);
  }
};

export default syncModels;