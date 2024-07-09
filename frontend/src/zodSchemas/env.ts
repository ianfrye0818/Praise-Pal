import * as z from 'zod';

const envSchema = z.object({
  VITE_NODE_ENV: z.string(),
  VITE_API_BASE_URL: z.string(),
});

export const env = envSchema.parse(import.meta.env);
