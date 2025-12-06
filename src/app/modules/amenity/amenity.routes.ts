import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { AmenityControllers } from "./amenity.controller";
import { createAmenitySchema, updateAmenitySchema } from "./amenity.validation";

const router = Router();

router.post(
  "/create-amenity",
  isAuthenticated,
  validateRequest(createAmenitySchema),
  AmenityControllers.createAmenity
);

router.get("/get-amenities", isAuthenticated, AmenityControllers.getAllAmenities);

router.get(
  "/get-amenity/:id",
  isAuthenticated,
  AmenityControllers.getAmenityById
);

router.patch(
  "/update-amenity/:id",
  isAuthenticated,
  validateRequest(updateAmenitySchema),
  AmenityControllers.updateAmenity
);

router.delete(
  "/delete-amenity/:id",
  isAuthenticated,
  AmenityControllers.deleteAmenity
);

export const AmenityRoutes = router;
