import type { Request, Response } from "express";
import { userService } from "../../services/user/index.js";

type HttpError = Error & {
  status?: number;
};

const register = async (req: Request, res: Response) => {
  try {
    const auth = await userService.register(req.body);

    return res.status(201).json({
      message: "Usuario registrado e autenticado com sucesso",
      ...auth,
    });
  } catch (error: unknown) {
    const httpError = error as HttpError;

    return res.status(httpError.status || 500).json({
      message: httpError.message || "Erro ao registrar usuario",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const auth = await userService.login(req.body);

    return res.status(200).json({
      message: "Login realizado com sucesso",
      ...auth,
    });
  } catch (error: unknown) {
    const httpError = error as HttpError;

    return res.status(httpError.status || 500).json({
      message: httpError.message || "Erro ao realizar login",
    });
  }
};

export const userController = {
  register,
  login,
};
