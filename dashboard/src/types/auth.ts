export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  createdAt: string;
}