import { z } from "zod";

export const createFacilitySchema = z.object({
  name_en: z.string().min(2, "English name is required"),
  name_bn: z.string().min(2, "Bangla name is required"),
  latitude: z.string().min(3, "Latitude is required"),
  longitude: z.string().min(3, "Longitude is required"),
  category: z.string().min(2, "Category is required"),
  upazilaId: z.number("Upazila ID is required" ),
  housings: z.array(z.number()).min(1, "At least one housing is required"),
});

export const updateFacilitySchema = z.object({
  name_en: z.string().min(2).optional(),
  name_bn: z.string().min(2).optional(),
  latitude: z.string().min(3).optional(),
  longitude: z.string().min(3).optional(),
  category: z.string().min(2).optional(),
  upazilaId: z.number().optional(),
  housings: z.array(z.number()).optional(),
});
