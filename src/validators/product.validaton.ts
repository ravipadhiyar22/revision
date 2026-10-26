import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// Fields the client can provide for each image.
// Image metadata and position are assigned by the backend.
const productImageInputSchema = z
    .object({
        key: z.string().trim().min(1).max(1024),

        alt: z.string().trim().min(1).max(250),
    })
    .strict();

export const createProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3)
            .max(150),

        sku: z
            .string()
            .trim()
            .toUpperCase()
            .min(1)
            .max(64)
            .regex(
                /^[A-Z0-9][A-Z0-9_-]*$/,
                "SKU can contain letters, numbers, hyphens and underscores"
            ),  
        description: z
            .string()
            .trim()
            .min(1)
            .max(5000),

        price: z
            .number()
            .finite()
            .min(0),

        stock: z
            .number()
            .int()
            .min(0)
            .default(0),

        categoryId: objectIdSchema,

        brandId: objectIdSchema,

        images: z
            .array(productImageInputSchema)
            .min(1, "At least one product image is required")
            .max(10, "A product can have at most 10 images"),
    })
    .strict();

export type CreateProductInput = z.infer<
    typeof createProductSchema
>;