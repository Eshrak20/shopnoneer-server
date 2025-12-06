import { Router } from "express";
import { updateProfileSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { multerUpload } from "../../config/multer.config";


const router = Router();

router.patch(
  "/update-profile",
  isAuthenticated,
  validateRequest(updateProfileSchema),
  UserControllers.updateUserProfile
);
router.patch(
  "/update-avatar",
  isAuthenticated,
  // validateRequest(updateProfileSchema),
  multerUpload.single("avatar"),
  UserControllers.updateUserAvatar
);
router.get(
  "/my-profile",
  isAuthenticated,
  UserControllers.getMyProfile
);


export const UserRoutes = router;
