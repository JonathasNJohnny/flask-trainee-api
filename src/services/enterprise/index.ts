import crypto from "crypto";
import jwt from "jsonwebtoken";
import { enterpriseRepository } from "../../repositories/enterprise/index.js";
import type {
  Enterprise,
  EnterpriseAuthResponse,
  EnterpriseLoginPayload,
  EnterpriseRegisterPayload,
  EnterpriseToCreate,
  SanitizedEnterprise,
} from "../../types/enterprise.js";

const JWT_EXPIRATION = "15m";

type HttpError = Error & {
  status?: number;
};

const throwHttpError = (status: number, message: string): never => {
  const error: HttpError = new Error(message);
  error.status = status;
  throw error;
};

const normalizeEmail = (email: unknown): string =>
  String(email || "")
    .trim()
    .toLowerCase();

const normalizeCnpj = (cnpj: unknown): string =>
  String(cnpj || "").replace(/\D/g, "");

const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
};

const comparePassword = (password: string, storedHash: string): boolean => {
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

const sanitizeEnterprise = (enterprise: Enterprise): SanitizedEnterprise => ({
  id: String(enterprise._id || ""),
  companyName: enterprise.company_name,
  cnpj: enterprise.cnpj,
  email: enterprise.email,
  companyStartDate: enterprise.company_start_date,
  createdAt: enterprise.created_at,
  phone: enterprise.phone || null,
  websiteUrl: enterprise.website_url || null,
});

const validateRegisterPayload = (
  payload: EnterpriseRegisterPayload,
): void => {
  const { cnpj, email, password } = payload || {};
  const companyName = payload?.companyName || payload?.company_name;
  const companyStartDate =
    payload?.companyStartDate || payload?.company_start_date;

  if (!companyName || !cnpj || !email || !password || !companyStartDate) {
    throwHttpError(400, "Todos os campos sao obrigatorios");
  }

  if (String(companyName).trim().length < 3) {
    throwHttpError(400, "Nome da empresa deve ter ao menos 3 caracteres");
  }

  if (normalizeCnpj(cnpj).length !== 14) {
    throwHttpError(400, "CNPJ invalido");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    throwHttpError(400, "Email invalido");
  }

  if (String(password).length < 8) {
    throwHttpError(400, "Senha deve ter no minimo 8 caracteres");
  }

  if (Number.isNaN(Date.parse(String(companyStartDate)))) {
    throwHttpError(400, "Data de inicio da empresa invalida");
  }
};

const validateLoginPayload = (payload: EnterpriseLoginPayload): void => {
  const { email, password } = payload || {};

  if (!email || !password) {
    throwHttpError(400, "Email e senha sao obrigatorios");
  }
};

const getJwtSecret = (): string => process.env.JWT_SECRET || "dev_secret_change_me";

const generateAuthResponse = (
  enterprise: Enterprise,
): EnterpriseAuthResponse => {
  const token = jwt.sign(
    {
      sub: String(enterprise._id || ""),
      companyName: enterprise.company_name,
      cnpj: enterprise.cnpj,
      email: enterprise.email,
      accountType: "enterprise",
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRATION },
  );

  return {
    token,
    expiresIn: JWT_EXPIRATION,
    enterprise: sanitizeEnterprise(enterprise),
  };
};

const register = async (
  payload: EnterpriseRegisterPayload,
): Promise<EnterpriseAuthResponse> => {
  validateRegisterPayload(payload);

  const normalizedEmail = normalizeEmail(payload.email);
  const normalizedCnpj = normalizeCnpj(payload.cnpj);

  const existingEnterpriseByEmail =
    await enterpriseRepository.findByEmail(normalizedEmail);

  if (existingEnterpriseByEmail) {
    throwHttpError(409, "Ja existe empresa com esse email");
  }

  const existingEnterpriseByCnpj =
    await enterpriseRepository.findByCnpj(normalizedCnpj);

  if (existingEnterpriseByCnpj) {
    throwHttpError(409, "Ja existe empresa com esse CNPJ");
  }

  const now = new Date().toISOString();
  const companyName = payload?.companyName || payload?.company_name;
  const companyStartDate =
    payload?.companyStartDate || payload?.company_start_date;

  const enterpriseToCreate: EnterpriseToCreate = {
    company_name: String(companyName).trim(),
    cnpj: normalizedCnpj,
    email: normalizedEmail,
    password_hash: hashPassword(String(payload.password)),
    company_start_date: String(companyStartDate),
    created_at: now,
  };

  const optionalFields: Record<
    keyof Pick<EnterpriseToCreate, "phone" | "website_url">,
    unknown
  > = {
    phone: payload?.phone,
    website_url: payload?.website_url,
  };

  for (const [key, value] of Object.entries(optionalFields) as Array<
    [keyof typeof optionalFields, unknown]
  >) {
    if (typeof value === "string" && value.trim()) {
      enterpriseToCreate[key] = value.trim();
    }
  }

  const createdEnterprise =
    await enterpriseRepository.create(enterpriseToCreate);

  return generateAuthResponse(createdEnterprise);
};

const login = async (
  payload: EnterpriseLoginPayload,
): Promise<EnterpriseAuthResponse> => {
  validateLoginPayload(payload);

  const normalizedEmail = normalizeEmail(payload.email);
  const enterprise = await enterpriseRepository.findByEmail(normalizedEmail);

  if (!enterprise) {
    throwHttpError(401, "Email ou senha invalidos");
  }

  const isPasswordValid = comparePassword(
    String(payload.password),
    enterprise!.password_hash,
  );

  if (!isPasswordValid) {
    throwHttpError(401, "Email ou senha invalidos");
  }

  return generateAuthResponse(enterprise!);
};

export const enterpriseService = {
  register,
  login,
};
