import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.ts";


export const roleMiddleware = (...requiredRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = req.user?.role; // Assuming req.user is set by the auth middleware

            if (!userRole) {
                return next(new ApiError(403, "Forbidden: No role found"));
            }

            if (!requiredRole.includes(userRole)) {
                return next(new ApiError(403, "Forbidden: Insufficient permissions"));
            }

            next();
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

