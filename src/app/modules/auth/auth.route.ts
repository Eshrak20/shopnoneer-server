import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema, signupSchema } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/signup",
  validateRequest(signupSchema),
  AuthController.signupController
);
router.post(
  "/login",
  validateRequest(loginSchema),
  AuthController.loginController
);
router.post("/logout", AuthController.logoutController);
router.post("/reset-password",
  isAuthenticated,
  AuthController.resetPassword
)



export const AuthRoutes = router;
