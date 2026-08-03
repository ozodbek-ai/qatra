import express from "express";

import cors from "cors";
import authRoutes from "./routes/auth.routes";

import courseRoutes from "./routes/course.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import lessonRoutes from "./routes/lesson.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import questionRoutes from "./routes/question.routes.js";
import optionRoutes from "./routes/option.routes.js";
import studentRoutes from "./routes/student.routes.js";
import adminDashboardRoutes from "./routes/admin-dashboard.routes.js";
import searchRoutes from "./routes/search.routes.js";
import completionRoutes from "./routes/course-completion.routes.js";
import certificateRoutes
from "./routes/certificate.routes.js";



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
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/options", optionRoutes);
app.use(
  "/api/v1/admin/students",
  studentRoutes
);
app.use(
  "/api/v1/admin/dashboard",
  adminDashboardRoutes
);
app.use(
  "/api/v1/admin/search",
  searchRoutes
);
app.use(
  "/api/v1/completions",
  completionRoutes
);
app.use(
  "/api/v1/certificates",
  certificateRoutes
);

// ❗ Error middleware eng oxirida bo'lishi kerak
app.use(errorHandler);

export default app;