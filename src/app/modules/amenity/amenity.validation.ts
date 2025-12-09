import { z } from "zod";

export const createAmenitySchema = z.object({
    name_en: z.string().min(1, "English name is required"),
    name_bn: z.string().min(1, "Bangla name is required"),
    web_icon: z.string().optional(),
    android_icon: z.string().optional(),
    ios_icon: z.string().optional(),
});

export const updateAmenitySchema = z.object({
    name_en: z.string().min(1, "English name is required").optional(),
    name_bn: z.string().min(1, "Bangla name is required").optional(),
    web_icon: z.string().optional(),
    android_icon: z.string().optional(),
    ios_icon: z.string().optional(),
});
