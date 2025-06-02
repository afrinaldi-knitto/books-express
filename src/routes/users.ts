import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config/config";
import {
  authenticationJwt,
  AuthRequest,
  requireRole,
} from "../middleware/auth";
import { prisma } from "../prisma";

const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password min 6 characters"),
});

type UserRegisterInput = z.infer<typeof UserRegisterSchema>;

const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
type UserLoginInput = z.infer<typeof UserLoginSchema>;

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs collection
 */

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: nal@email.com
 *             password: nalldev
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = UserRegisterSchema.parse(req.body);
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email: email,
        password: passwordHashed,
      },
    });
    res.json({ message: "User registered successfully", data: user });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login to your account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: nal@email.com
 *             password: nalldev
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", async (req, res, next): Promise<void> => {
  try {
    const { email, password } = UserLoginSchema.parse(req.body);

    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid email/password" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Invalid email/password" });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.json({
      message: "Success",
      data: {
        token: token,
        email: email,
      },
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @openapi
 * /api/me:
 *   get:
 *     summary: Get user info
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid
 *       500:
 *         description: Internal Server Error
 */
router.get("/me", authenticationJwt, async (req: AuthRequest, res, next) => {
  try {
    if (req.user) {
      const { id, role } = req.user;
      res.json({
        id: id,
        role: role,
      });
    } else {
      throw Error("Invalid token");
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get users
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/users",
  authenticationJwt,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const users = await prisma.users.findMany({
        where: {
          role: "user",
        },
      });
      res.json({
        message: "Success",
        data: users.map((item) => ({
          id: item.id,
          email: item.email,
        })),
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
