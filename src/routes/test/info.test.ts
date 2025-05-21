import request from "supertest";
import app from "../../app";

describe("API /api/info", () => {
  it("Should return app info", async () => {
    const res = await request(app).get("/api/info");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ app: "My Backend", version: "1.0.0" });
  });
});
