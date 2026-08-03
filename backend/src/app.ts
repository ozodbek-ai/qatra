import express from "express";

import cors from "cors";
import authRoutes from "./routes/auth.routes";

import courseRoutes from "./routes/course.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import lessonRoutes from "./routes/lesson.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import progressRoutes from "./routes/progress.routes.js";


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
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);

// ❗ Error middleware eng oxirida bo'lishi kerak
app.use(errorHandler);

export default app;