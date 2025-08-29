// config/db.js
import pkg from 'pg';
import { DATABASE_URL } from './env.js';

const { Pool } = pkg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  // SSL configuration for Render.com and other cloud providers
  ssl: {
    rejectUnauthorized: false,
  },
  
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  min: 5,  // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
  maxUses: 7500, // Close (and replace) a connection after it has been used this many times
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Database connection test
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 as health_check');
    client.release();
    return { 
      status: 'healthy', 
      message: 'Database connection is working',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Execute query with error handling
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', { text, error: error.message });
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Initialize database with extensions and basic setup
export const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');
    
    // Create extensions
    await query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    
    console.log('✅ Database extensions created successfully');
    
    // You can add table creation queries here if needed
    // Or use migration files
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Seed default data
export const seedDefaultData = async () => {
  try {
    console.log('🌱 Seeding default data...');
    
    // Insert default categories
    const categories = [
      { name: 'Roads', description: 'Potholes, obstructions, road damage', color_code: '#FF4444' },
      { name: 'Lighting', description: 'Broken or flickering lights', color_code: '#FFAA00' },
      { name: 'Water Supply', description: 'Leaks, low pressure, water issues', color_code: '#0099FF' },
      { name: 'Cleanliness', description: 'Overflowing bins, garbage, littering', color_code: '#00AA44' },
      { name: 'Public Safety', description: 'Open manholes, exposed wiring, safety hazards', color_code: '#AA0000' },
      { name: 'Obstructions', description: 'Fallen trees, debris, blocked paths', color_code: '#8B4513' }
    ];

    for (const category of categories) {
      await query(`
        INSERT INTO categories (name, description, color_code)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
      `, [category.name, category.description, category.color_code]);
    }

    // Insert default issue statuses
    const statuses = [
      { name: 'Reported', description: 'Issue has been reported and is pending review', color_code: '#FFA500', sort_order: 1 },
      { name: 'In Progress', description: 'Issue is being worked on by authorities', color_code: '#0066CC', sort_order: 2 },
      { name: 'Resolved', description: 'Issue has been resolved', color_code: '#00AA00', sort_order: 3 },
      { name: 'Rejected', description: 'Issue was deemed invalid or duplicate', color_code: '#AA0000', sort_order: 4 },
      { name: 'On Hold', description: 'Issue resolution is temporarily paused', color_code: '#808080', sort_order: 5 }
    ];

    for (const status of statuses) {
      await query(`
        INSERT INTO issue_status (name, description, color_code, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
      `, [status.name, status.description, status.color_code, status.sort_order]);
    }

    console.log('✅ Default data seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
};

// Graceful shutdown
export const closePool = async () => {
  try {
    await pool.end();
    console.log('🔌 Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

// Export pool as default
export default pool;