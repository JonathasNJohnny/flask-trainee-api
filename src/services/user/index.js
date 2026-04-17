import crypto from "crypto";
import jwt from "jsonwebtoken";
import { userRepository } from "../../repositories/user/index.js";

const JWT_EXPIRATION = "15m";

const throwHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
};

const comparePassword = (password, storedHash) => {
  const [salt, hashed] = String(storedHash || "").split(":");

  if (!salt || !hashed) {
    return false;
  }

  const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hashed, "hex"),
    Buffer.from(passwordHash, "hex"),
  );
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  dateOfBirth: user.dateOfBirth,
  createdAt: user.createdAt,
});

const validateRegisterPayload = (payload) => {
  const { name, email, password, dateOfBirth } = payload || {};

  if (!name || !email || !password || !dateOfBirth) {
    throwHttpError(400, "Todos os campos sao obrigatorios");
  }

  if (String(name).trim().length < 3) {
    throwHttpError(400, "Nome deve ter ao menos 3 caracteres");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    throwHttpError(400, "Email invalido");
  }

  if (String(password).length < 8) {
    throwHttpError(400, "Senha deve ter no minimo 8 caracteres");
  }

  if (Number.isNaN(Date.parse(dateOfBirth))) {
    throwHttpError(400, "Data de nascimento invalida");
  }
};

const validateLoginPayload = (payload) => {
  const { email, password } = payload || {};

  if (!email || !password) {
    throwHttpError(400, "Email e senha sao obrigatorios");
  }
};

const getJwtSecret = () => process.env.JWT_SECRET || "dev_secret_change_me";

const register = async (payload) => {
  validateRegisterPayload(payload);

  const normalizedEmail = normalizeEmail(payload.email);
  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throwHttpError(409, "Ja existe usuario com esse email");
  }

  const now = new Date().toISOString();

  const userToCreate = {
    id: crypto.randomUUID(),
    name: String(payload.name).trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(String(payload.password)),
    dateOfBirth: String(payload.dateOfBirth),
    createdAt: now,
  };

  const createdUser = await userRepository.create(userToCreate);

  return sanitizeUser(createdUser);
};

const login = async (payload) => {
  validateLoginPayload(payload);

  const normalizedEmail = normalizeEmail(payload.email);
  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    throwHttpError(401, "Email ou senha invalidos");
  }

  const isPasswordValid = comparePassword(
    String(payload.password),
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throwHttpError(401, "Email ou senha invalidos");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRATION },
  );

  return {
    token,
    expiresIn: JWT_EXPIRATION,
    user: sanitizeUser(user),
  };
};

export const userService = {
  register,
  login,
};
