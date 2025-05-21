import { NextFunction, Request, Response, Router } from "express";
import { Author } from "../models/author";
import { authenticationJwt, requireRole } from "../middleware/auth";
import { prisma } from "../prisma";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Author
 *   description: Author APIs collection
 */

/**
 * @openapi
 * /api/authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Author
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get(
  "/authors",
  async (
    req: Request,
    res: Response<Success<Author[]> | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const authors = await prisma.authors.findMany({
        select: { id: true, name: true, books: true },
      });

      const authorWithBooks = authors.map((item) => ({
        id: item.id,
        name: item.name,
        books: item.books ? item.books.map((item) => item.title) : null,
      }));

      res.json({ message: "Success", data: authorWithBooks });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/author/{id}:
 *   get:
 *     summary: Get author
 *     tags:
 *       - Author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get(
  "/author/:id",
  async (
    req: Request<{ id: string }>,
    res: Response<Success<any> | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const author = await prisma.authors.findFirstOrThrow({
        select: { id: true, name: true, books: true },
        where: {
          id: Number(req.params.id),
        },
      });

      const authorWithBooks = {
        id: author.id,
        name: author.name,
        books: author.books ? author.books.map((item) => item.title) : null,
      };

      res.json({ message: "Success", data: authorWithBooks });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/author:
 *   post:
 *     summary: Create new author
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *           example:
 *             name: nal
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/author",
  authenticationJwt,
  async (
    req: Request<{}, {}, { name: string }>,
    res: Response<Success<Author> | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }
    try {
      const author = await prisma.authors.create({
        data: {
          name: name,
        },
        select: { id: true, name: true, books: true },
      });
      const authorWithBooks = {
        id: author.id,
        name: author.name,
        books: author.books ? author.books.map((item) => item.title) : null,
      };
      res
        .status(201)
        .json({ message: "Author created", data: authorWithBooks });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
);

/**
 * @openapi
 * /api/author/{id}:
 *   patch:
 *     summary: Update author by id
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *           example:
 *             name: new name
 *     responses:
 *       200:
 *         description: Author was updated
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/author/:id",
  authenticationJwt,
  async (
    req: Request<{ id: string }, {}, { name: string }>,
    res: Response<Success<{}> | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const { name } = req.body;
      const author = await prisma.authors.update({
        data: {
          name: name,
        },
        where: {
          id: Number(req.params.id),
        },
      });
      res.json({ message: "Author was updated", data: author });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/author/{id}:
 *   delete:
 *     summary: delete author
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Not Found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/author/:id",
  authenticationJwt,
  requireRole("admin"),
  async (
    req: Request<{ id: string }>,
    res: Response<Success<{}> | { error: string }>,
    next: NextFunction
  ) => {
    try {
      await prisma.authors.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.json({
        message: "Author was deleted",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
