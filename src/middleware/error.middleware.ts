import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { ApiError } from "../utils/ApiError.ts";


export const errorMiddleware = async (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: "validation error",
            errors: Object.values(err.errors).map((error) => error.message),
        });
    }
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            success: false,
            message: "validation error",
            errors: z.flattenError(err),
        });
    }
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: "cast error",
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}