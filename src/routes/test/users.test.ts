import { Prisma } from "@prisma/client";
import app from "../../app";
import { prisma } from "../../prisma";
import request from "supertest";

//mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("mockedHash"),
}));

//mock prisma.users.create
jest.mock("../../prisma", () => {
  const mPrisma = {
    users: {
      create: jest.fn(),
    },
  };
  return { prisma: mPrisma };
});

describe("POST /api/register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should registser user successfully", async () => {
    (prisma.users.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: "nal@email.com",
      password: "mockedHash",
      role: "user",
    });

    const res = await request(app)
      .post("/api/register")
      .send({ email: "nal@email.com", password: "nalldev" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "User registered successfully",
      data: {
        id: 1,
        email: "nal@email.com",
        password: "mockedHash",
        role: "user",
      },
    });
  });

  it("should fail with validator error (short password)", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ email: "naldev@email.com", password: "nal" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/Validation error/i);
    expect(res.body.details).toMatch(/Password min 6 characters/i);
  });

  it("should fail with validator error (invalid email)", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ email: "naldev@emaim", password: "nalldev" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/Validation error/i);
    expect(res.body.details).toMatch(/Invalid email/i);
  });

  it("should fail with duplicated email", async () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed on the fields: (`email`)",
      { code: "P2002", clientVersion: "test-client-version" }
    );

    (prisma.users.create as jest.Mock).mockRejectedValue(error);

    const res = await request(app)
      .post("/api/register")
      .send({ email: "nalldev@email.com", password: "nalldev" });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toContain("Resource already exists");
  });

  it("should fail with unexpected error", async () => {
    const err = new Error("Unexpected");
    (prisma.users.create as jest.Mock).mockRejectedValue(err);

    const res = await request(app)
      .post("/api/register")
      .send({ email: "nalldev@email.com", password: "nalldev" });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Internal server error");
  });
});
