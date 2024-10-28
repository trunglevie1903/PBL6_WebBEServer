import { Optional } from "sequelize";

export interface UserProfile_Interface {
  userId: string;
  bannerImagePath: string | null;
  avatarImagePath: string | null;
  description: string | null;
}

export interface UserProfile_CreationInterface extends Optional<
  UserProfile_Interface,
  "userId" | "bannerImagePath" | "avatarImagePath" | "description"
>{};