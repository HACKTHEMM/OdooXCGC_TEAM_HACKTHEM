import pkg from 'pg';
import { DATABASE_URL } from './env.js';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
