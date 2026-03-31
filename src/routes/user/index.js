import { Router } from "express";
import { register } from "../../controllers/user/index.js";

const router = Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *               - nomeCompleto
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: minhaSenha123
 *               nomeCompleto:
 *                 type: string
 *                 example: Joao da Silva
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.post("/register", (req, res) => {
  const result = register(req);
  res.send(result);
});

export default router;
