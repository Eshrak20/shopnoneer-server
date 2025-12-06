import { z } from "zod";

export const createProjectSchema = z.object({
  name_en: z.string().min(2),
  name_bn: z.string().min(2),
  description: z.string().min(2),

  no_of_beds: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),
  no_of_baths: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),
  no_of_balcony: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),

  rate_per_sqft: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),
  floor_area: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),
  floor_no: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),
  total_price: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined)),

  images: z.array(z.string()).optional(),

  divisionId: z
    .string()
    .transform(Number),
  districtId: z
    .string()
    .transform(Number),
  upazilaId: z
    .string()
    .transform(Number),
  housingId: z
    .string()
    .transform(Number),
  amenities: z
    .string()
    .optional()
    .transform(val => (val ? JSON.parse(val) : [])) // parse stringified array
});

export const updateProjectSchema = createProjectSchema.partial();

// Type inference
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
