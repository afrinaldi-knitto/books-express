import { Router } from "express";

const router = Router();
/**
 * @openapi
 * /api/info:
 *   get:
 *     summary: Get API info
 *     responses:
 *       200:
 *         description: A Successful response
 *         content:
 *           application/json:
 *             example:
 *               app: My Backend
 *               version: 1.0.0
 */
router.get("/api/info", (req, res) => {
  res.json({ app: "My Backend", version: "1.0.0" });
});

export default router;
