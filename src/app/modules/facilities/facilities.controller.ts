import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { FacilitiesService } from "./facilities.service";

const createFacility = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const facility = await FacilitiesService.createFacility(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Facility created successfully",
    data: facility,
  });
});

const getAllFacilities = catchAsync(async (req: Request, res: Response) => {
  const facilities = await FacilitiesService.getAllFacilities();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All facilities fetched successfully",
    data: facilities,
  });
});

const getFacilityById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const facility = await FacilitiesService.getFacilityById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Facility fetched successfully",
    data: facility,
  });
});

const updateFacility = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload = req.body;
  const updatedFacility = await FacilitiesService.updateFacility(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Facility updated successfully",
    data: updatedFacility,
  });
});

const deleteFacility = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await FacilitiesService.deleteFacility(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Facility deleted successfully",
    data: null,
  });
});

export const FacilitiesControllers = {
  createFacility,
  getAllFacilities,
  getFacilityById,
  updateFacility,
  deleteFacility,
};
