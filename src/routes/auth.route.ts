import { Router } from "express";
import { loginUser, registerUser, logoutUser, getCurrentUser, getUser, getUsers } from "../controller/auth.controller.ts";
import { validate } from "../middleware/validator.middleware.ts";
import { registerSchema, loginSchema } from "../validators/user.validation.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { roleMiddleware } from "../middleware/role.middleware.ts";
const router = Router();

router.post("/register",
    validate(registerSchema),
    registerUser);
router.post("/login",
    validate(loginSchema),
    loginUser);

router.use(authMiddleware); // Apply auth middleware to all routes below this line
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

router.get("/user/:id", roleMiddleware("admin"), getUser);
router.get("/users", roleMiddleware("admin"), getUsers);
export default router;