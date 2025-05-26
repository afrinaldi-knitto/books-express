import { Router } from "express";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../controllers/author.controller";
import { authenticationJwt, requireRole } from "../../middleware/auth";

/**
 * @swagger
 * tags:
 *   name: Author
 *   description: Author APIs collection
 */

const router = Router();

/**
 * @openapi
 * /api/v1/authors:
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
router.get("/authors", getAuthors);

/**
 * @openapi
 * /api/v1/author/{id}:
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
router.get("/author/:id", getAuthorById);

/**
 * @openapi
 * /api/v1/author:
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
router.post("/author", authenticationJwt, createAuthor);

/**
 * @openapi
 * /api/v1/author/{id}:
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
router.patch("/author/:id", authenticationJwt, updateAuthor);

/**
 * @openapi
 * /api/v1/author/{id}:
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
  deleteAuthor
);

export default router;
