// userTokens.ts
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { PrismaClient, User } from "@prisma/client";
import { generateToken, verifyToken } from "./jwt";

const prisma = new PrismaClient();

// Create access + refresh tokens for a user
export const createUserTokens = (user: Partial<User>) => {
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role_id: user.role_id,
        // isActive: user['is_active'] || true, // optional if you add is_active field
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRES
    );

    return {
        accessToken,
        refreshToken,
    };
};

// Generate new access token using refresh token
export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    // Verify the refresh token
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    // Find user in PostgreSQL using Prisma
    const user = await prisma.user.findUnique({
        where: { email: verifiedRefreshToken.email },
        include: { profile: true }, // optional if you want profile
    });

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }

    // Optional: check user status if you have `is_active` field
    // if (user['is_active'] === false) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User is inactive or blocked");
    // }

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role_id: user.role_id,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES
    );

    return accessToken;
};
