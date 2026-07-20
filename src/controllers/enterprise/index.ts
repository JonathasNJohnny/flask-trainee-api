import type { Request, Response } from "express";
import { enterpriseService } from "../../services/enterprise/index.js";

type HttpError = Error & {
  status?: number;
};

const register = async (req: Request, res: Response) => {
  try {
    const auth = await enterpriseService.register(req.body);

    return res.status(201).json({
      message: "Empresa registrada e autenticada com sucesso",
      ...auth,
    });
  } catch (error: unknown) {
    const httpError = error as HttpError;

    return res.status(httpError.status || 500).json({
      message: httpError.message || "Erro ao registrar empresa",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const auth = await enterpriseService.login(req.body);

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

export const enterpriseController = {
  register,
  login,
};
