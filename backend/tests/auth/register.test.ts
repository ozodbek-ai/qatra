import { describe, expect, it } from "vitest";
import { api } from "../helpers/request.js";

describe("POST /api/v1/auth/register", () => {
  it("should reject empty body", async () => {
    const res = await api
      .post("/api/v1/auth/register")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should register a new user", async () => {
    const email = `test-${Date.now()}@example.com`;

    const res = await api
      .post("/api/v1/auth/register")
      .send({
        fullName: "Test User",
        email,
        password: "Password123!",
      });

    expect(res.status).toBe(201);

    expect(res.body.success).toBe(true);

    expect(res.body.data).toMatchObject({
      fullName: "Test User",
      email,
      role: "STUDENT",
    });

    expect(res.body.data.id).toBeDefined();

    expect(res.body.data.createdAt).toBeDefined();
  });

  it("should reject duplicate email", async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    const first = await api
  .post("/api/v1/auth/register")
  .send({
    fullName: "Duplicate User",
    email,
    password: "Password123!",
  });

console.log("FIRST STATUS:", first.status);
console.log("FIRST BODY:", first.body);

const second = await api
  .post("/api/v1/auth/register")
  .send({
    fullName: "Duplicate User",
    email,
    password: "Password123!",
  });

console.log("SECOND STATUS:", second.status);
console.log("SECOND BODY:", second.body);

expect(second.status).toBe(409);

expect(second.body.success).toBe(false);
  });
});