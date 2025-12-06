/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";


const updateUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId; // TypeScript knows it exists
    const payload = req.body;

    const result = await UserService.updateProfile(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile updated successfully",
      data: result,
    });
  }
);


const updateUserAvatar = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId; // From JWT middleware
    const file = req.file;
    console.log("file",file)

    if (!file) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "No file uploaded",
        data: null, // ✅ add this
      });
    }

    const updatedUser = await UserService.updateUserAvatar(userId, file.path);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User avatar updated successfully",
      data: updatedUser,
    });
  }
);


const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  console.log(req.cookies)
  const result = await UserService.getMyProfile(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile fetched successfully",
    data: result,
  });
});





export const UserControllers = {
  updateUserProfile,
  getMyProfile,
  updateUserAvatar
};
