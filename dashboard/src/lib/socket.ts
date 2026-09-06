import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  return socket;
};

export const connectSocket = (
  accessToken: string
) => {
  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  const socketUrl =
    import.meta.env.VITE_SOCKET_URL;

  socket = io(socketUrl, {
    auth: {
      token: accessToken,
    },

    transports: ["websocket"],

    autoConnect: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) {
    return;
  }

  socket.disconnect();

  socket = null;
};