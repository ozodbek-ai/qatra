import { describe, expect, it } from "vitest";
import { api } from "../helpers/request.js";
import { createAuthenticatedAdmin } from "../helpers/admin.js";

describe("POST /courses", () => {
  it("should create course", async () => {
    const { token } =
      await createAuthenticatedAdmin();

    const res = await api
      .post("/api/v1/courses")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        title: "Flutter 4.0",
        slug: `flutter-${Date.now()}`,
        description: "Flutter Course",
        price: 100,
        level: "BEGINNER",
      });
      console.log("STATUS:", res.status);
      console.log("BODY:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(201);

    expect(res.body.success).toBe(true);

    expect(res.body.data.title)
      .toBe("Flutter 4.0");
  });
});