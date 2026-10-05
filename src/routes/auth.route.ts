import { Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller.ts";
import { validate } from "../middleware/validator.middleware.ts";
import { registerSchema, loginSchema } from "../validators/user.validation.ts";

const router = Router();

router.post("/register",
    validate(registerSchema),
    registerUser);
router.post("/login",
    validate(loginSchema),
    loginUser);
export default router;