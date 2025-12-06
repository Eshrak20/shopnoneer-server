import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { createHousingSchema, updateHousingSchema } from "./housing.validation";
import { HousingControllers } from "./housing.controller";

const router = Router();

// CRUD Routes
router.post(
  "/create-housing",
  isAuthenticated,
  validateRequest(createHousingSchema),
  HousingControllers.createHousing
);

router.get("/get-housing", isAuthenticated, HousingControllers.getAllHousings);
router.get("/get-housing/:id", isAuthenticated, HousingControllers.getHousingById);

router.patch(
  "/update-housing/:id",
  isAuthenticated,
  validateRequest(updateHousingSchema),
  HousingControllers.updateHousing
);

router.delete("/:id", isAuthenticated, HousingControllers.deleteHousing);

export const HousingRoutes = router;
