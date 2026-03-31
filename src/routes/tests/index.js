import { Router } from "express";
import { testFromTest } from "../../controllers/tests/index.js";

const router = Router();

/**
 * @swagger
 * /test/tests:
 *   get:
 *     summary: Apenas uma rota de testes
 *     description: Apenas uma rota de testes
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get("/test", () => {
  const result = testFromTest();
  res.send(result);
});

export default router;
