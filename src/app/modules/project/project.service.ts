import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { prisma } from "../../config/db";
import { ProjectStatus } from "@prisma/client";
import { cleanupCloudinaryImages, cloudinaryUpload } from "../../config/cloudinary.config";
import { PrismaQueryBuilder } from "../../utils/QueryBuilder";


const createProject = async (data: any, files: Express.Multer.File[], userId: number) => {
    const { amenities, ...projectData } = data;

    // Cloudinary uploaded file paths
    const imageUrls = files?.map(file => file.path) || [];

    try {
        // Try creating the project
        const project = await prisma.project.create({
            data: {
                name_en: projectData.name_en,
                name_bn: projectData.name_bn,
                description: projectData.description,
                no_of_beds: projectData.no_of_beds,
                no_of_baths: projectData.no_of_baths,
                no_of_balcony: projectData.no_of_balcony,
                rate_per_sqft: projectData.rate_per_sqft,
                floor_area: projectData.floor_area,
                floor_no: projectData.floor_no,
                total_price: projectData.total_price,
                images: imageUrls,

                division: { connect: { id: projectData.divisionId } },
                district: { connect: { id: projectData.districtId } },
                upazila: { connect: { id: projectData.upazilaId } },
                housing: { connect: { id: projectData.housingId } },
                createdBy: { connect: { id: userId } },

                amenities: {
                    create: amenities?.map((id: number) => ({
                        amenity: { connect: { id } }
                    })) || []
                }
            },
            include: {
                amenities: { include: { amenity: true } }
            }
        });

        return project;

    } catch (error) {
        console.error("Error creating project:", error);

        // ❗ Rollback: Delete uploaded cloudinary images
        await Promise.all(
            imageUrls.map(async (url) => {
                try {
                    const publicId = url.split("/").pop()?.split(".")[0]; // extract public id
                    if (publicId) {
                        await cloudinaryUpload.uploader.destroy(publicId);
                    }
                } catch (err) {
                    console.error("Cloudinary delete failed:", err);
                }
            })
        );

        throw error; // rethrow so error handler catches it
    }
};



const updateProject = async (
    id: number,
    data: any,
    files: Express.Multer.File[] | undefined,
    userId: number
) => {
    // 1. Get old project data
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

    const oldImages = project.images || [];

    const { amenities, ...projectData } = data;

    // 2. Uploaded new images
    const newImageUrls = files?.map(file => file.path) || [];

    // If new images uploaded → replace old ones, else keep old ones
    const updatedImages = newImageUrls.length > 0 ? newImageUrls : oldImages;

    try {
        // Delete old project-amenities
        await prisma.projectAmenity.deleteMany({ where: { projectId: id } });

        // Update Project
        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                name_en: projectData.name_en,
                name_bn: projectData.name_bn,
                description: projectData.description,
                no_of_beds: projectData.no_of_beds,
                no_of_baths: projectData.no_of_baths,
                no_of_balcony: projectData.no_of_balcony,
                rate_per_sqft: projectData.rate_per_sqft,
                floor_area: projectData.floor_area,
                floor_no: projectData.floor_no,
                total_price: projectData.total_price,
                images: updatedImages,

                division: projectData.divisionId ? { connect: { id: projectData.divisionId } } : undefined,
                district: projectData.districtId ? { connect: { id: projectData.districtId } } : undefined,
                upazila: projectData.upazilaId ? { connect: { id: projectData.upazilaId } } : undefined,
                housing: projectData.housingId ? { connect: { id: projectData.housingId } } : undefined,

                createdBy: { connect: { id: userId } },

                amenities: {
                    create: amenities?.map((id: number) => ({ amenity: { connect: { id } } })) || []
                }
            },
            include: {
                amenities: { include: { amenity: true } }
            }
        });

        // 3. If update was successful AND new images uploaded → delete old images
        if (newImageUrls.length > 0) {
            await cleanupCloudinaryImages(oldImages); // delete old ones
        }

        return updatedProject;
    } catch (error) {
        console.error("Update project error:", error);

        // 4. If update failed → delete newly uploaded images to prevent garbage
        await cleanupCloudinaryImages(newImageUrls);

        throw error; // rethrow error
    }
};

const updateProjectStatus = async (id: number, status: string) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

    // Convert string to enum
    const statusEnum = status as ProjectStatus;

    return prisma.project.update({
        where: { id },
        data: { status: statusEnum },
    });
};




const getAllProjects = async (query: any) => {
  const qb = new PrismaQueryBuilder(prisma.project, query);

  const data = await qb
    .filter()
    .applyProjectFilters()
    .search(["name_en", "name_bn", "description"])
    .sort()
    .paginate()
    .include({
      district: true,
      upazila: true,
      housing: true,
      createdBy: true,
      division: true,
      amenities: { include: { amenity: true } },
    })
    .build();

  const meta = await qb.getMeta();

  return { data, meta };
};

const getMyProjects = async (userId: number) => {
    return prisma.project.findMany({
        where: {
            createdById: userId,
        },
        include: {
            amenities: true,
            district: true,
            upazila: true,
            housing: true,
            createdBy: true,
        },
        orderBy: {
            id: "desc",
        },
    });
};



const getProjectById = async (id: number) => {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            district: true,
            upazila: true,
            housing: true,
            createdBy: true,
            amenities: { include: { amenity: true } },
        },
    });

    if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

    return project;
};


const deleteMyProject = async (projectId: number, userId: number) => {

    const project = await prisma.project.findFirst({
        where: { id: projectId, createdById: userId },
    });

    if (!project) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to delete this project"
        );
    }

    // 1. Delete images from Cloudinary
    await cleanupCloudinaryImages(project.images || []);

    // 2. Delete project from DB
    return prisma.project.delete({
        where: { id: projectId },
    });
};


const deleteProject = async (id: number) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

    // Delete cloud images
    await cleanupCloudinaryImages(project.images || []);

    // Soft delete (mark as deleted)
    return prisma.project.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};


export const ProjectService = {
    createProject,
    getAllProjects,
    getMyProjects,
    getProjectById,
    updateProject,
    updateProjectStatus,
    deleteMyProject,
    deleteProject,
};
