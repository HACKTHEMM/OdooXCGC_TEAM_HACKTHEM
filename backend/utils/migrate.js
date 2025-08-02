import { initializeDatabase, closePool } from '../config/db.js';

(async () => {
  await initializeDatabase();
  await closePool();
})();