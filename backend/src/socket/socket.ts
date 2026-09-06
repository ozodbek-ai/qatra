import type { Server as HttpServer } from "http";

import { Server } from "socket.io";

import { logger } from "../lib/logger.js";
import { verifyAccessToken } from "../lib/jwt.js";

import type { SocketUser } from "../types/socket.js";

export let io: Server;

export function initializeSocket(
  httpServer: HttpServer
) {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3001",
      ],

      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token;

      if (
        typeof token !== "string" ||
        !token
      ) {
        return next(
          new Error(
            "Authentication token topilmadi."
          )
        );
      }

      const payload =
        verifyAccessToken(
          token
        ) as SocketUser;

      socket.data.user = payload;

      next();
    } catch (error) {
      logger.error(error);

      next(
        new Error(
          "Socket authentication muvaffaqiyatsiz."
        )
      );
    }
  });

  io.on("connection", (socket) => {
    const user =
      socket.data.user as SocketUser;

    socket.join(
      `user:${user.userId}`
    );

    logger.info({
      message: "Socket user connected",
      socketId: socket.id,
      userId: user.userId,
    });

    socket.on("disconnect", () => {
      logger.info({
        message: "Socket user disconnected",
        socketId: socket.id,
        userId: user.userId,
      });
    });
  });

  logger.info(
    "Socket.IO initialized"
  );

  return io;
}