import { User } from "../models/user.model.ts";
import type { Request, Response, NextFunction } from "express";
import type { RegisterInput } from "../validators/user.validation.ts";
import { ApiError } from "../utils/ApiError.ts";

export const registerUser = async (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            next(new ApiError(400, "User already exists"));
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: "user created successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            next(new ApiError(400, "Invalid email or password"));
        }
        const isPasswordValid = await user?.comparePassword(password);
        if (!isPasswordValid) {
            next(new ApiError(400, "Invalid email or password"));
        }

        const token = await user?.generateAccessToken();
        res.status(200)
            .cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            }).json({
                success: true,
                message: "user logged in successfully",
            });
    } catch (error) {
        next(error);
    }
}


export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }).status(200).json({
            success: true,
            message: "user logged out successfully",
        });

    } catch (error) {
        next(error);
    }
}


export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const userData = await User.findById(user?.id).select("-password");
        if (!userData) {
            next(new ApiError(404, "User not found"));
        }
        return res.status(200).json({
            success: true,
            message: "user fetched successfully",
            data: userData,
        });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            next(new ApiError(404, "User not found"));
        }
        return res.status(200).json({
            success: true,
            message: "user fetched successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), User.countDocuments()]);
        return res.status(200).json({
            success: true,
            message: "users fetched successfully",
            data: users,
        });
    } catch (error) {
        next(error);
    }
}