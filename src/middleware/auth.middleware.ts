import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.ts";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const isUserToken = (payload: string | JwtPayload): payload is UserToken => {
    return typeof payload !== "string"
        && typeof payload.id === "string"
        && typeof payload.role === "string";
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!isUserToken(decode)) {
            return next(new ApiError(401, "Unauthorized"));
        }

        req.user = decode;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}