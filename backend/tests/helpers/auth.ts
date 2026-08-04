import { api } from "./request.js";

export async function createAuthenticatedUser() {
  const email = `user-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;

  const password = "Password123!";

  const register = await api
    .post("/api/v1/auth/register")
    .send({
      fullName: "Test User",
      email,
      password,
    });

  const login = await api
    .post("/api/v1/auth/login")
    .send({
      email,
      password,
    });

  return {
    user: register.body.data,
    token: login.body.data.accessToken,
    email,
    password,
  };
}