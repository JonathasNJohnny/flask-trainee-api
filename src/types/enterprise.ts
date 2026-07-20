import type { ObjectId } from "mongodb";

export type EnterpriseRegisterPayload = {
  companyName?: unknown;
  company_name?: unknown;
  cnpj?: unknown;
  email?: unknown;
  password?: unknown;
  companyStartDate?: unknown;
  company_start_date?: unknown;
  phone?: unknown;
  website_url?: unknown;
};

export type EnterpriseLoginPayload = {
  email?: unknown;
  password?: unknown;
};

export type Enterprise = {
  _id?: ObjectId;
  company_name: string;
  cnpj: string;
  email: string;
  password_hash: string;
  company_start_date: string;
  created_at: string;
  phone?: string;
  website_url?: string;
};

export type EnterpriseToCreate = Omit<Enterprise, "_id">;

export type SanitizedEnterprise = {
  id: string;
  companyName: string;
  cnpj: string;
  email: string;
  companyStartDate: string;
  createdAt: string;
  phone: string | null;
  websiteUrl: string | null;
};

export type EnterpriseAuthResponse = {
  token: string;
  expiresIn: string;
  enterprise: SanitizedEnterprise;
};
