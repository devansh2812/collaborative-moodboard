import { Pool } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
  connectionString: env.databaseUrl
});

export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const res = await pool.query(sql, params);
  return res.rows as T[];
}

