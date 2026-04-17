import { Router } from "express";
import { testController } from "../../controllers/tests/index.js";

const router = Router();

/**
 * @swagger
 * /test/tests:
 *   get:
 *     tags: [Test]
 *     summary: Apenas uma rota de testes
 *     description: Apenas uma rota de testes
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get("/test", (req, res) => {
  const result = testController.testFromTest();
  res.send(result);
});

export default router;
