import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


let socket: Socket | null = null;


function getSocketUrl(): string {
  return API_URL.replace(/\/api\/v1\/?$/, "");
}


export async function connectSocket(): Promise<Socket | null> {
  if (socket?.connected) {
    return socket;
  }

  const token =
    await getAccessToken();

  if (!token) {
    console.log(
      "Socket ulanishi uchun token topilmadi."
    );

    return null;
  }

  const socketUrl =
    getSocketUrl();


  socket = io(socketUrl, {
    transports: ["websocket"],

    auth: {
      token,
    },

    autoConnect: true,

    reconnection: true,

    reconnectionAttempts: 10,

    reconnectionDelay: 1000,

    reconnectionDelayMax: 5000,
  });


  socket.on("connect", () => {
    console.log(
      "Socket connected:",
      socket?.id
    );
  });


  socket.on("disconnect", (reason) => {
    console.log(
      "Socket disconnected:",
      reason
    );
  });


  socket.on("connect_error", (error) => {
    console.log(
      "Socket connection error:",
      error.message
    );
  });


  return socket;
}


export function getSocket(): Socket | null {
  return socket;
}


export function disconnectSocket(): void {
  if (!socket) {
    return;
  }

  socket.disconnect();

  socket = null;

  console.log(
    "Socket disconnected manually."
  );
}