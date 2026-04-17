import { userService } from "../../services/user/index.js";

const register = async (req, res) => {
  try {
    const auth = await userService.register(req.body);

    return res.status(201).json({
      message: "Usuario registrado e autenticado com sucesso",
      ...auth,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Erro ao registrar usuario",
    });
  }
};

const login = async (req, res) => {
  try {
    const auth = await userService.login(req.body);

    return res.status(200).json({
      message: "Login realizado com sucesso",
      ...auth,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Erro ao realizar login",
    });
  }
};

export const userController = {
  register,
  login,
};
