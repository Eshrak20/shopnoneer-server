// modules/user/user.validation.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),

  age: z.number().optional(),
  occupation: z.string().optional(),
  religion: z.string().optional(),

  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  preferableAddress: z.string().optional(),

  presentDivision: z.string().optional(),
  permanentDivision: z.string().optional(),
  preferableDivision: z.string().optional(),

  presentDistrict: z.string().optional(),
  permanentDistrict: z.string().optional(),
  preferableDistrict: z.string().optional(),

  presentUpazila: z.string().optional(),
  permanentUpazila: z.string().optional(),
  preferableUpazila: z.string().optional(),

  monthlyIncome: z.number().optional(),
  familyMembers: z.number().optional(),
  preferableFlat: z.string().optional(),
  preferableFlatSize: z.string().optional(),
});

export const updateAvatarSchema = z.object(
  {
    avatar: z.string().min(2).optional(),
  }
)