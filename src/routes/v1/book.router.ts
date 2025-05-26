import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "../../controllers/book.controller";
import { authenticationJwt, requireRole } from "../../middleware/auth";

/**
 * @swagger
 * tags:
 *   name: Book
 *   description: Book APIs collection
 */
const router = Router();

/**
 * @openapi
 * /api/v1/books:
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
router.get("/books", getBooks);

/**
 * @openapi
 * /api/v1/book/{id}:
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
router.get("/book/:id", getBookById);

/**
 * @openapi
 * /api/v1/book:
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
router.post("/book", authenticationJwt, createBook);

/**
 * @openapi
 * /api/book/{id}:
 *   patch:
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
router.patch("/book/:id", authenticationJwt, updateBook);

/**
 * @openapi
 * /api/v1/book/{id}:
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
router.delete("/book/:id", authenticationJwt, requireRole("admin"), deleteBook);

export default router;
