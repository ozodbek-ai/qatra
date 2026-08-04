import { describe, expect, it } from "vitest";

import { api } from "./helpers/request.js";

describe("Health API", () => {

  it("GET /health", async () => {

    const res =
      await api.get("/health");

    expect(res.status).toBe(200);

    expect(res.body.status)
      .toBe("OK");

  });

});