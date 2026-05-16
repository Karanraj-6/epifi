import { z } from 'zod';

const emailField = z.string().trim().email().max(254).transform((email) => email.toLowerCase());

export const registerSchema = z.object({
  email: emailField,
  password: z.string().min(8, 'Password must be at least 8 characters').max(128)
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1).max(128)
});

export const authSchema = registerSchema;

export const noteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(10000)
});

export const improveSchema = z.object({
  content: z.string().trim().min(1).max(10000)
});

export const shareSchema = z.object({
  share_with_email: z.string().trim().email().max(254).transform((email) => email.toLowerCase())
});

export const favoriteSchema = z.object({
  is_favorite: z.boolean()
});

export const uuidParamSchema = z.object({
  id: z.string().uuid()
});

export function parsePagination(query) {
  const page = Math.max(Number.parseInt(query.page || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || '20', 10) || 20, 1), 100);
  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}
