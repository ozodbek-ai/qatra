import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) {
    return socket;
  }

  const token =
    localStorage.getItem("accessToken");

  socket = io(
    import.meta.env.VITE_SOCKET_URL,
    {
      auth: {
        token,
      },

      autoConnect: false,

      transports: ["websocket"],
    }
  );

  return socket;
}

export function connectSocket() {
  const socketInstance =
    getSocket();

  /*
   * Token login vaqtida o'zgargan
   * bo'lishi mumkin.
   */
  socketInstance.auth = {
    token:
      localStorage.getItem(
        "accessToken"
      ),
  };

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
}

export function disconnectSocket() {
  if (!socket) {
    return;
  }

  socket.disconnect();

  socket = null;
}