import UserProfile from "../models/UserProfile";

class UserProfileService {
  static findByPk = async (userId: string) => {
    try {
      if (!userId) throw new Error("Invalid user ID");

      const userProfile = await UserProfile.findByPk(userId);
      if (!userProfile) throw new Error("User not found");
      if (userProfile instanceof Error) throw userProfile;
      return userProfile;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : error);
    }
  };
}

export default UserProfileService;