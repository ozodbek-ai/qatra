import express from "express";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";

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
import userRoutes from "./routes/user.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { pinoHttp } from "pino-http";
import { logger } from "./lib/logger.js";




const app = express();

// Security headers
app.use(helmet());

// Response compression
app.use(compression());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message:
        "Juda ko'p so'rov yuborildi. Keyinroq urinib ko'ring.",
    },
  })
);

app.use(
  pinoHttp({
    logger,
  })
);

// JSON parser
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Qatra Backend API ishlayapti 🚀",
  });
});

app.get("/health", (_, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
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
app.use(
  "/api/v1/admin/users",
  userRoutes
);
app.use(
  "/api/v1/reviews",
  reviewRoutes
);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ❗ Error middleware eng oxirida bo'lishi kerak
app.use(errorHandler);

export default app;