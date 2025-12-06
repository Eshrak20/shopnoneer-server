import { PrismaClient } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const prisma = new PrismaClient();

// const createFacility = async (data: any) => {
//   return prisma.facilities.create({ data });
// };




const createFacility = async (data: any) => {
    const { housings, ...facilityData } = data;
    console.log(data)
    return prisma.facilities.create({
        data: {
            ...facilityData,
            housings: {
                create: housings.map((hid: number) => ({
                    housing: { connect: { id: hid } },
                })),
            },
        },
        include: { housings: { include: { housing: true } } },
    });
};



const getAllFacilities = async () => {
    return prisma.facilities.findMany({ include: { upazila: true, housings: { include: { housing: true } } } });
};

const getFacilityById = async (id: number) => {
    const facility = await prisma.facilities.findUnique({
        where: { id },
        include: { upazila: true, housings: { include: { housing: true } } },
    });
    if (!facility) throw new AppError(httpStatus.NOT_FOUND, "Facility not found");
    return facility;
};

const updateFacility = async (id: number, data: any) => {
    const facility = await prisma.facilities.findUnique({ where: { id } });
    if (!facility) throw new AppError(httpStatus.NOT_FOUND, "Facility not found");

    return prisma.facilities.update({ where: { id }, data });
};

const deleteFacility = async (id: number) => {
    const facility = await prisma.facilities.findUnique({ where: { id } });
    if (!facility) throw new AppError(httpStatus.NOT_FOUND, "Facility not found");

    return prisma.facilities.delete({ where: { id } });
};

export const FacilitiesService = {
    createFacility,
    getAllFacilities,
    getFacilityById,
    updateFacility,
    deleteFacility,
};
