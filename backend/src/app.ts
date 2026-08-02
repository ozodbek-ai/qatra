import express from "express";

import cors from "cors";
import authRoutes from "./routes/auth.routes";

import courseRoutes from "./routes/course.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import lessonRoutes from "./routes/lesson.routes.js";


const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Qatra Backend API ishlayapti 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);

// ❗ Error middleware eng oxirida bo'lishi kerak
app.use(errorHandler);
app.use("/api/v1/lessons", lessonRoutes);

export default app;