import { register as registerService } from "../../services/user/index.js";

export const register = (req) => {
  const body = req.body;
  const response = registerService(body);
  return response;
};
