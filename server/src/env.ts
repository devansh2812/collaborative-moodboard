import 'dotenv/config';

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  port: Number(process.env.PORT ?? 4000),
  allowOrigin: process.env.ALLOW_ORIGIN ?? 'http://localhost:5173'
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

