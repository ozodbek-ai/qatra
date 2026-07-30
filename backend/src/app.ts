import express from "express";
import cors from "cors";

import courseRoutes from "./routes/course.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

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

app.use("/api/v1/courses", courseRoutes);

// ❗ Error middleware eng oxirida bo'lishi kerak
app.use(errorHandler);

export default app;