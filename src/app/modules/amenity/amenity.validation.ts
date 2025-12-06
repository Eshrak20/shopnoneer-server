import { z } from "zod";

export const createAmenitySchema = z.object({
    name_en: z.string().min(1, "English name is required"),
    name_bn: z.string().min(1, "Bangla name is required"),
    web_icon: z.string().url("Web icon must be a valid URL"),
    android_icon: z.string().url("Android icon must be a valid URL"),
    ios_icon: z.string().url("iOS icon must be a valid URL"),
});

export const updateAmenitySchema = z.object({
    name_en: z.string().min(1, "English name is required"),
    name_bn: z.string().min(1, "Bangla name is required"),
    web_icon: z.string().url("Web icon must be a valid URL"),
    android_icon: z.string().url("Android icon must be a valid URL"),
    ios_icon: z.string().url("iOS icon must be a valid URL"),
});
