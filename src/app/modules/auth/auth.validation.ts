// modules/user/user.validation.ts
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role_id: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]).default(3),   // 👈 DEFAULT USER ROLE
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


