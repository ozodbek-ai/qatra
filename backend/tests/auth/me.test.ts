import { describe, expect, it } from "vitest";
import { api } from "../helpers/request.js";
import { createAuthenticatedUser } from "../helpers/auth.js";

describe("GET /api/v1/auth/me", () => {
  it("should return current user", async () => {
    const { token, email } =
  await createAuthenticatedUser();

const res = await api
  .get("/api/v1/auth/me")
  .set("Authorization", `Bearer ${token}`);

expect(res.status).toBe(200);

expect(res.body.success).toBe(true);

expect(res.body.data.email).toBe(email);

expect(res.body.data.role).toBe("STUDENT");
  });

  it("should reject request without token", async () => {
    const res = await api.get("/api/v1/auth/me");

    expect(res.status).toBe(401);

    expect(res.body.success).toBe(false);
  });

  it("should reject invalid token", async () => {
    const res = await api
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);

    expect(res.body.success).toBe(false);
  });
});