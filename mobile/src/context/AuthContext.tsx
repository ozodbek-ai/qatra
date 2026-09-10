import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  registerUser,
  getMe,
  type User,
} from "@/services/auth.service";

import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "@/services/storage.service";

import {
  connectSocket,
  disconnectSocket,
} from "@/services/socket.service";


type AuthContextType = {
  user: User | null;

  isLoading: boolean;

  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};


const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);


  const restoreSession = async () => {
    try {
      const token =
        await getAccessToken();

      if (!token) {
        return;
      }

      const response =
        await getMe(token);

      setUser({
        id: response.data.userId,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
        avatarUrl:
          response.data.avatarUrl ?? null,
      });

    } catch {
      await removeAccessToken();

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    restoreSession();
  }, []);


const login = async (
  email: string,
  password: string
) => {
  const response =
    await loginUser(
      email.trim(),
      password
    );

  await saveAccessToken(
    response.data.accessToken
  );

  setUser(response.data.user);

  try {
    await connectSocket();
  } catch (error) {
    console.log(
      "Socket ulanishida xatolik:",
      error
    );
  }
};

  const register = async (
  fullName: string,
  email: string,
  password: string
) => {
  await registerUser(
    fullName.trim(),
    email.trim(),
    password
  );
};


const logout = async () => {
  disconnectSocket();

  await removeAccessToken();

  setUser(null);
};


  const refreshUser = async () => {
    const token =
      await getAccessToken();

    if (!token) {
      setUser(null);
      return;
    }

    const response =
      await getMe(token);

    setUser({
      id: response.data.userId,
      fullName: response.data.fullName,
      email: response.data.email,
      role: response.data.role,
      avatarUrl:
        response.data.avatarUrl ?? null,
    });

    try {
  await connectSocket();
} catch (error) {
  console.log(
    "Session tiklanganda socket ulanishida xatolik:",
    error
  );
}
  };


  return (
    <AuthContext.Provider
      value={{
  user,
  isLoading,
  isAuthenticated: user !== null,
  login,
  register,
  logout,
  refreshUser,
}}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth AuthProvider ichida ishlatilishi kerak."
    );
  }

  return context;
}