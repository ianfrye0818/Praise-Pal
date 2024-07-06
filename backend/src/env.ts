import * as z from 'zod';

const envSchema = z.object({
  SENDGRID_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  PORT: z.string(),
  NODE_ENV: z.string(),
  CLIENT_URL: z.string(),
  RESEND_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
