import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AmenityService } from "./amenity.service";

const createAmenity = catchAsync(async (req: Request, res: Response) => {
  const amenity = await AmenityService.createAmenity(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Amenity created successfully",
    data: amenity,
  });
});

const getAllAmenities = catchAsync(async (req: Request, res: Response) => {
  const amenities = await AmenityService.getAllAmenities();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All amenities fetched successfully",
    data: amenities,
  });
});

const getAmenityById = catchAsync(async (req: Request, res: Response) => {
  const amenity = await AmenityService.getAmenityById(Number(req.params.id));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Amenity fetched successfully",
    data: amenity,
  });
});

const updateAmenity = catchAsync(async (req: Request, res: Response) => {
  const amenity = await AmenityService.updateAmenity(Number(req.params.id), req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Amenity updated successfully",
    data: amenity,
  });
});

const deleteAmenity = catchAsync(async (req: Request, res: Response) => {
  await AmenityService.deleteAmenity(Number(req.params.id));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Amenity deleted successfully",
    data: null,
  });
});

export const AmenityControllers = {
  createAmenity,
  getAllAmenities,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
};
