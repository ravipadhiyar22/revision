import { z } from "zod";
import type { Request, Response, NextFunction } from "express";


export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        console.log("Validation result:", result);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "validation error",
                errors: z.flattenError(result.error),
            });
        }

        next();
    };
};