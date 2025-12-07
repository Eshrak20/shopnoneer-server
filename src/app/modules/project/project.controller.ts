import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectService } from "./project.service";

const createProject = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const userId = (req.user as any).userId;

    const project = await ProjectService.createProject(req.body, files, userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Project created successfully",
        data: project,
    });
});


const getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const result = await ProjectService.getAllProjects(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All projects fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});



const getMyProjects = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId; // logged-in user ID
    console.log(userId)
    const projects = await ProjectService.getMyProjects(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your projects fetched successfully",
        data: projects,
    });
});


const getProjectById = catchAsync(async (req: Request, res: Response) => {
    const project = await ProjectService.getProjectById(Number(req.params.id));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project fetched successfully",
        data: project,
    });
});

const updateProject = catchAsync(
    async (req: Request, res: Response) => {
        console.log(req.body)
        // return
        const projectId = Number(req.params.id); // assuming route: /projects/:id
        const files = req.files as Express.Multer.File[] | undefined;
        const userId = (req.user as any).userId;
        const project = await ProjectService.updateProject(
            projectId,
            req.body,
            files,
            userId
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Project updated successfully",
            data: project,
        });
    }
);

const updateProjectStatus = catchAsync(
    async (req: Request, res: Response) => {
        const projectId = Number(req.params.id);
        const { status } = req.body;

        const project = await ProjectService.updateProjectStatus(projectId, status);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Project status updated successfully",
            data: project,
        });
    }
);

const deleteMyProject = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;
    const projectId = Number(req.params.id);

    const result = await ProjectService.deleteMyProject(projectId, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project deleted successfully",
        data: result,
    });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
    await ProjectService.deleteProject(Number(req.params.id));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project deleted (soft) successfully",
        data: null,
    });
});

export const ProjectControllers = {
    createProject,
    getAllProjects,
    getMyProjects,
    getProjectById,
    updateProject,
    updateProjectStatus,
    deleteMyProject,
    deleteProject,
};
