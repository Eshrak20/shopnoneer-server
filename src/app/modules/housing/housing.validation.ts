import { z } from "zod";

export const createHousingSchema = z.object({
  name_en: z.string().min(2, "English name is required"),
  name_bn: z.string().min(2, "Bangla name is required"),
  latitude: z.string().min(3, "Latitude is required"),
  longitude: z.string().min(3, "Longitude is required"),
  upazilaId: z.number({ required_error: "Upazila ID is required" }),
  facilities: z.array(z.number()).optional(), // optional
});

export const updateHousingSchema = z.object({
  name_en: z.string().min(2).optional(),
  name_bn: z.string().min(2).optional(),
  latitude: z.string().min(3).optional(),
  longitude: z.string().min(3).optional(),
  upazilaId: z.number().optional(),
  facilities: z.array(z.number()).optional(),
});
