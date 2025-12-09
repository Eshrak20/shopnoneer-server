import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { createFacilitySchema, updateFacilitySchema } from "./facilities.validation";
import { FacilitiesControllers } from "./facilities.controller";

const router = Router();

router.post(
  "/create-facilities",
  isAuthenticated,
  validateRequest(createFacilitySchema),
  FacilitiesControllers.createFacility
);

router.get("/get-facilities/", FacilitiesControllers.getAllFacilities);
router.get("/get-facilities/:id", FacilitiesControllers.getFacilityById);

router.patch(
  "/update-facilities/:id",
  isAuthenticated,
  validateRequest(updateFacilitySchema),
  FacilitiesControllers.updateFacility
);

router.delete("/:id", isAuthenticated, FacilitiesControllers.deleteFacility);

export const FacilitiesRoutes = router;
