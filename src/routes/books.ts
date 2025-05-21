import { NextFunction, Request, Response, Router } from "express";
import { Book, BookPayload } from "../models/book";
import { authenticationJwt, requireRole } from "../middleware/auth";
import { prisma } from "../prisma";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Book
 *   description: Book APIs collection
 */

/**
 * @openapi
 * /api/books:
 *   get:
 *     summary: GET books
 *     tags:
 *       - Book
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/books",
  async (
    req: Request,
    res: Response<Success<Book[]> | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const books = await prisma.books.findMany({
        include: {
          authors: true,
        },
      });

      res.json({ message: "Success show books", data: books });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/book/{id}:
 *   get:
 *     summary: Get book
 *     tags:
 *       - Book
 *     parameters:
 *       - in : path
 *         name : id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/book/:id",
  async (
    req: Request<{ id: string }>,
    res: Response<Success<Book> | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const book = await prisma.books.findFirstOrThrow({
        where: {
          id: Number(id),
        },
        select: { id: true, title: true, authors: true },
      });
      res.json({ message: "Success", data: book });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/book:
 *   post:
 *     summary: Insert book
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author_id:
 *                 type: integer
 *           example:
 *             title: how to be express expert?
 *             author_id: 4
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/book",
  authenticationJwt,
  async (
    req: Request<{}, {}, BookPayload>,
    res: Response<any | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const { title, author_id } = req.body;
      const book = await prisma.books.create({
        data: {
          title: title,
          author_id: author_id,
        },
      });
      res.json({ message: "Book inserted", data: book });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/book/{id}:
 *   put:
 *     summary: Update a book
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not Found
 */
router.put(
  "/book/:id",
  authenticationJwt,
  async (
    req: Request<
      { id: string },
      {},
      { title?: string; author_id?: number | null }
    >,
    res: Response<Book | { error: string }>,
    next: NextFunction
  ) => {
    const { title, author_id } = req.body;
    try {
      const book = await prisma.books.update({
        select: { title: true, authors: true },
        data: {
          title: title,
          author_id: author_id,
        },
        where: {
          id: Number(req.params.id),
        },
      });
      res.json({
        id: Number(req.params.id),
        title: book.title,
        author: book.authors
          ? {
              id: book.authors.id,
              name: book.authors.name,
              books: null,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/book/{id}:
 *   delete:
 *     summary: Delete a book
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Not Found
 */
router.delete(
  "/book/:id",
  authenticationJwt,
  requireRole("admin"),
  async (
    req: Request<{ id: string }>,
    res: Response<{ error: string } | any>,
    next: NextFunction
  ) => {
    try {
      const book = await prisma.books.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.json({ message: "Success deleted", data: book });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
