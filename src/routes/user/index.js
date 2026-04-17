import { Router } from "express";
import { userController } from "../../controllers/user/index.js";

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
 *               - name
 *               - email
 *               - password
 *               - dateOfBirth
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Usuário criado
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     description: Realiza o login de um usuário
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
router.post("/login", userController.login);

export default router;
