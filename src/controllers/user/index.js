import { register as registerService } from "../../services/user/index.js";

export const register = (req) => {
  const body = req.body;
  const query = req.query;
  const response = registerService(body, query);
  return response;
};
