import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieparser from "cookie-parser";
import helmet from "helmet";
const app = express();


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(helmet());


//declare routes
import authRoutes from "./routes/auth.route.ts";
import { errorMiddleware } from "./middleware/error.middleware.ts";

app.use("/api/v1/auth", authRoutes);


app.use(errorMiddleware);
export { app };