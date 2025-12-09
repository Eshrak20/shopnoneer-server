import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ILogin, ISignup } from "./auth.interface";
import { createUserTokens } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const signupService = async (payload: ISignup) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      role_id: payload.role_id,
      profile: {
        create: {
          name: payload.name,
          bio: "",
          avatar: ""
        }
      }
    },
    include: { profile: true }
  });
};



const loginService = async (payload: ILogin) => {
  const { email, password } = payload;

  // Find user and include profile
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const userTokens = createUserTokens(user)


  // Remove password before returning
  const { password: pwd, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
  };
};

// I just make it for just convention
const logoutService = async () => {
  return { message: "Logged out successfully" };
};


const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  userId: number
) => {
  // Find the user by ID
  const user = await prisma.user.findUnique({
    where: {
      id: userId, // make sure userId exists in decodedToken
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if old password matches
  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
  }
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  // Update user password in database
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};
export const AuthService = {
  signupService,
  loginService,
  logoutService,
  resetPassword
};
