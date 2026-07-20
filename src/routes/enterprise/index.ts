import { Router } from "express";
import { enterpriseController } from "../../controllers/enterprise/index.js";

const router = Router();

/**
 * @swagger
 * /enterprise/register:
 *   post:
 *     tags: [Enterprise]
 *     summary: Registra uma nova empresa
 *     description: Registra uma nova empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - cnpj
 *               - email
 *               - password
 *               - companyStartDate
 *             properties:
 *               companyName:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               companyStartDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Empresa criada e autenticada com token JWT
 */
router.post("/register", enterpriseController.register);

/**
 * @swagger
 * /enterprise/login:
 *   post:
 *     tags: [Enterprise]
 *     summary: Realiza o login de uma empresa
 *     description: Realiza o login de uma empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT gerado
 */
router.post("/login", enterpriseController.login);

export default router;
