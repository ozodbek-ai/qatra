import { api } from "./request.js";
import { prisma } from "../../src/lib/prisma.js";

export async function createAuthenticatedAdmin() {
  const email = `admin-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;

  const password = "Password123!";

  await api
    .post("/api/v1/auth/register")
    .send({
      fullName: "Admin User",
      email,
      password,
    });

  await prisma.user.update({
    where: { email },
    data: {
      role: "ADMIN",
    },
  });

  const login = await api
    .post("/api/v1/auth/login")
    .send({
      email,
      password,
    });

  return {
    token: login.body.data.accessToken,
    email,
    password,
  };
}