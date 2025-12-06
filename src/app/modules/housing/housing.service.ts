import { PrismaClient } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const prisma = new PrismaClient();

// const createHousing = async (data: any) => {
//   return prisma.housing.create({
//     data,
//   });
// };

const createHousing = async (data: any) => {
  const { facilities, ...housingData } = data;

  return prisma.housing.create({
    data: {
      ...housingData,
      facilities: facilities?.length
        ? {
            create: facilities.map((fid: number) => ({
              facility: { connect: { id: fid } },
            })),
          }
        : undefined, // if none, do nothing
    },
    include: { facilities: { include: { facility: true } } },
  });
};




const getAllHousings = async () => {
  return prisma.housing.findMany({
    include: { facilities: { include: { facility: true } }, upazila: true },
  });
};

const getHousingById = async (id: number) => {
  const housing = await prisma.housing.findUnique({
    where: { id },
    include: { facilities: { include: { facility: true } }, upazila: true },
  });
  if (!housing) throw new AppError(httpStatus.NOT_FOUND, "Housing not found");
  return housing;
};

const updateHousing = async (id: number, data: any) => {
  const housing = await prisma.housing.findUnique({ where: { id } });
  if (!housing) throw new AppError(httpStatus.NOT_FOUND, "Housing not found");

  return prisma.housing.update({
    where: { id },
    data,
  });
};

const deleteHousing = async (id: number) => {
  const housing = await prisma.housing.findUnique({ where: { id } });
  if (!housing) throw new AppError(httpStatus.NOT_FOUND, "Housing not found");

  return prisma.housing.delete({ where: { id } });
};

export const HousingService = {
  createHousing,
  getAllHousings,
  getHousingById,
  updateHousing,
  deleteHousing,
};
