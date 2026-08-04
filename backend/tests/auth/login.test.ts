import { describe, expect, it } from "vitest";
import { api } from "../helpers/request.js";

describe("POST /api/v1/auth/login", () => {
  it("should login successfully", async () => {
    const email = `login-${Date.now()}@example.com`;

    await api
      .post("/api/v1/auth/register")
      .send({
        fullName: "Login Test",
        email,
        password: "Password123!",
      });

    const res = await api
      .post("/api/v1/auth/login")
      .send({
        email,
        password: "Password123!",
      });

    expect(res.status).toBe(200);

    expect(res.body.success).toBe(true);

    expect(res.body.data.accessToken).toBeDefined();

    expect(res.body.data.user).toMatchObject({
      fullName: "Login Test",
      email,
      role: "STUDENT",
    });
  });

  it("should reject wrong password", async () => {
    const email = `wrong-password-${Date.now()}@example.com`;

    await api
      .post("/api/v1/auth/register")
      .send({
        fullName: "Wrong Password",
        email,
        password: "Password123!",
      });

    const res = await api
      .post("/api/v1/auth/login")
      .send({
        email,
        password: "WrongPassword",
      });

    expect(res.status).toBe(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject unknown email", async () => {
    const res = await api
      .post("/api/v1/auth/login")
      .send({
        email: `unknown-${Date.now()}@example.com`,
        password: "Password123!",
      });

    expect(res.status).toBe(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject empty body", async () => {
    const res = await api
      .post("/api/v1/auth/login")
      .send({});

    expect(res.status).toBe(400);

    expect(res.body.success).toBe(false);
  });
});