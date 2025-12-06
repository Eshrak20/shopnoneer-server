import { PrismaClient } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const prisma = new PrismaClient();

const createAmenity = async (data: any) => {
  return prisma.amenity.create({ data });
};

const getAllAmenities = async () => {
  return prisma.amenity.findMany();
};

const getAmenityById = async (id: number) => {
  const amenity = await prisma.amenity.findUnique({ where: { id } });
  if (!amenity) throw new AppError(httpStatus.NOT_FOUND, "Amenity not found");
  return amenity;
};

const updateAmenity = async (id: number, data: any) => {
  const amenity = await prisma.amenity.findUnique({ where: { id } });
  if (!amenity) throw new AppError(httpStatus.NOT_FOUND, "Amenity not found");

  return prisma.amenity.update({
    where: { id },
    data,
  });
};

const deleteAmenity = async (id: number) => {
  const amenity = await prisma.amenity.findUnique({ where: { id } });
  if (!amenity) throw new AppError(httpStatus.NOT_FOUND, "Amenity not found");

  return prisma.amenity.delete({ where: { id } });
};

export const AmenityService = {
  createAmenity,
  getAllAmenities,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
};
