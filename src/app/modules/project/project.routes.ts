import { Router } from "express";
import { isAdminMiddleware, isAuthenticated } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProjectControllers } from "./project.controller";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
    "/create-project",
    multerUpload.array("images"), // field name must match `images` in form-data
    isAuthenticated,
    validateRequest(createProjectSchema),
    ProjectControllers.createProject
);


router.get("/get-projects",  ProjectControllers.getAllProjects);
router.get("/my-projects", isAuthenticated, ProjectControllers.getMyProjects);


router.get(
    "/get-project/:id",
    ProjectControllers.getProjectById
);

router.patch(
    "/update-project/:id",
    isAuthenticated,
    multerUpload.array("images"), // field name must match `images` in form-data
    validateRequest(updateProjectSchema),
    ProjectControllers.updateProject
);
router.patch(
    "/approve-project/:id",
    isAuthenticated,
    isAdminMiddleware,
    ProjectControllers.updateProjectStatus
);

router.delete(
    "/delete-project/:id",
    isAuthenticated,
    ProjectControllers.deleteProject
);
router.delete('/my-projects/:id', isAuthenticated, ProjectControllers.deleteMyProject);


export const ProjectRoutes = router;
