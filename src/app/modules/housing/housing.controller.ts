import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { HousingService } from "./housing.service";

const createHousing = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const housing = await HousingService.createHousing(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Housing created successfully",
    data: housing,
  });
});

const getAllHousings = catchAsync(async (req: Request, res: Response) => {
  const housings = await HousingService.getAllHousings(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All housings fetched successfully",
    data: housings,
  });
});

const getHousingById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const housing = await HousingService.getHousingById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Housing fetched successfully",
    data: housing,
  });
});

const updateHousing = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload = req.body;
  const updatedHousing = await HousingService.updateHousing(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Housing updated successfully",
    data: updatedHousing,
  });
});

const deleteHousing = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await HousingService.deleteHousing(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Housing deleted successfully",
    data: null,
  });
});

export const HousingControllers = {
  createHousing,
  getAllHousings,
  getHousingById,
  updateHousing,
  deleteHousing,
};
