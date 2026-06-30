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
  id: String(user._id || ""),
  name: user.name,
  email: user.email,
  dateOfBirth: user.date_of_birth,
  createdAt: user.created_at,
  phone: user.phone || null,
  githubUrl: user.github_url || null,
  linkedinUrl: user.linkedin_url || null,
  portfolioUrl: user.portfolio_url || null,
  pfpUrl: user.pfp_url || null,
});

const validateRegisterPayload = (payload) => {
  const { name, email, password } = payload || {};
  const dateOfBirth = payload?.dateOfBirth || payload?.date_of_birth;

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

const generateAuthResponse = (user) => {
  const token = jwt.sign(
    {
      sub: String(user._id || ""),
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

const register = async (payload) => {
  validateRegisterPayload(payload);

  const normalizedEmail = normalizeEmail(payload.email);
  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throwHttpError(409, "Ja existe usuario com esse email");
  }

  const now = new Date().toISOString();
  const dateOfBirth = payload?.dateOfBirth || payload?.date_of_birth;

  const userToCreate = {
    name: String(payload.name).trim(),
    email: normalizedEmail,
    password_hash: hashPassword(String(payload.password)),
    date_of_birth: String(dateOfBirth),
    created_at: now,
  };

  const optionalFields = {
    phone: payload?.phone,
    github_url: payload?.github_url,
    linkedin_url: payload?.linkedin_url,
    portfolio_url: payload?.portfolio_url,
    pfp_url: payload?.pfp_url,
  };

  for (const [key, value] of Object.entries(optionalFields)) {
    if (typeof value === "string" && value.trim()) {
      userToCreate[key] = value.trim();
    }
  }

  const createdUser = await userRepository.create(userToCreate);

  return generateAuthResponse(createdUser);
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
    user.password_hash,
  );

  if (!isPasswordValid) {
    throwHttpError(401, "Email ou senha invalidos");
  }

  return generateAuthResponse(user);
};

export const userService = {
  register,
  login,
};
