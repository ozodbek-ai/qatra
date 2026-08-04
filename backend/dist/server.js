import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
const PORT = Number(env.PORT);
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
});
process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down...");
    server.close(() => {
        logger.info("Server stopped.");
        process.exit(0);
    });
});
process.on("SIGINT", () => {
    logger.info("SIGINT received. Shutting down...");
    server.close(() => {
        logger.info("Server stopped.");
        process.exit(0);
    });
});
