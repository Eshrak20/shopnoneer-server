import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { envVars } from "../../config/env";

const signupController = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AuthService.signupService(req.body);
        // Remove password from response
        setAuthCookie(res, {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User created successfully",
            data: result,
        });
    }
);

const loginController = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginService(req.body);

    // Optionally set cookie for web
    setAuthCookie(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login successful",
        data: result, // includes user with profile + tokens
    });
});

// src/app/modules/auth/auth.controller.ts

const logoutController = catchAsync(async (req: Request, res: Response) => {
    await AuthService.logoutService();

    // Clear cookies
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: "none",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: "none",
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logout successful",
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = (req.user as any).userId;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await AuthService.resetPassword(oldPassword, newPassword, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})

export const AuthController = {
    signupController,
    loginController,
    logoutController,
    resetPassword
};
