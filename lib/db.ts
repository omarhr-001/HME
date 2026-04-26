import { Pool, QueryResult } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute a query on the database
 */
export async function query(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[DB] Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('[DB] Query error', { text, error });
    throw error;
  }
}

/**
 * Get a single row from the database
 */
export async function getRow<T = any>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T | null> {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Get multiple rows from the database
 */
export async function getRows<T = any>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
