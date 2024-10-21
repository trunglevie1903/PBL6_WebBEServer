import { Optional } from "sequelize";

export interface UserProfile_Interface {
  userId: string;
  bannerImage: string | null;
  avatarImage: string | null;
  description: string | null;
}

export interface UserProfile_CreationInterface extends Optional<
  UserProfile_Interface,
  "userId" | "bannerImage" | "avatarImage" | "description"
>{};