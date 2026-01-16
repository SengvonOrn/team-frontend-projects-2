import { z } from "zod";

/* --------------------------------------------------
   ENUM
-------------------------------------------------- */
export const ProductStatusEnum = z.enum([
  "DRAFT",
  "ACTIVE",
  "ARCHIVED",
  "OUT_OF_STOCK",
]);

/* --------------------------------------------------
   ZOD SCHEMA
-------------------------------------------------- */
export const addProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be less than 200 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters"),

  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),

  brand: z.string().max(100).optional(),

  // comma-separated in form, converted later
  tags: z.string().optional(),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase with hyphens only",
    }),

  status: ProductStatusEnum.default("ACTIVE"),

  storeId: z.string().uuid("Invalid store ID"),
});
