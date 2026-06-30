import type { ObjectId } from "mongodb";

export type RegisterPayload = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  dateOfBirth?: unknown;
  date_of_birth?: unknown;
  phone?: unknown;
  github_url?: unknown;
  linkedin_url?: unknown;
  portfolio_url?: unknown;
  pfp_url?: unknown;
};

export type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

export type Student = {
  _id?: ObjectId;
  name: string;
  email: string;
  password_hash: string;
  date_of_birth: string;
  created_at: string;
  phone?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  pfp_url?: string;
};

export type StudentToCreate = Omit<Student, "_id">;

export type SanitizedUser = {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  createdAt: string;
  phone: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  pfpUrl: string | null;
};

export type AuthResponse = {
  token: string;
  expiresIn: string;
  user: SanitizedUser;
};
