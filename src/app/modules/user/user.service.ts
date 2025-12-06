import { PrismaClient } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import httpStatus from "http-status-codes";

const prisma = new PrismaClient();

const updateProfile = async (userId: number, data: any) => {
  return prisma.profile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

const getMyProfile = async (userId: number) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { user: { select: { id: true, email: true, role_id: true } } },
  });

  return profile;
};



const updateUserAvatar = async (userId: number, avatarPath: string) => {
  // Get existing profile
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  // Delete old avatar if exists
  if (profile.avatar) {
    await deleteImageFromCLoudinary(profile.avatar);
  }

  // Update avatar path
  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: { avatar: avatarPath },
  });

  return updatedProfile;
}



export const UserService = {
  updateProfile,
  getMyProfile,
  updateUserAvatar
};
