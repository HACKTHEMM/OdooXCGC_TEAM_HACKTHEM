// setup-database.js
import { query, testConnection, initializeDatabase, seedDefaultData } from './config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDatabase = async () => {
    console.log('🔧 Setting up database...');

    try {
        // Test connection first
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ Database connection failed. Please check your DATABASE_URL');
            process.exit(1);
        }

        // Read and execute SQL setup file
        const sqlFile = path.join(__dirname, 'database_setup.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Split SQL file by semicolons and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

        console.log(`📝 Executing ${statements.length} SQL statements...`);

        for (const statement of statements) {
            try {
                await query(statement.trim());
            } catch (err) {
                // Ignore errors for statements that might already exist
                if (!err.message.includes('already exists') && !err.message.includes('duplicate key')) {
                    console.warn('⚠️  SQL Warning:', err.message);
                }
            }
        }

        console.log('✅ Database setup completed successfully!');
        console.log('📊 Database tables and default data have been created.');

        // Test a simple query
        const testResult = await query('SELECT COUNT(*) as count FROM categories');
        console.log(`📈 Categories table has ${testResult.rows[0].count} entries`);

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
};

setupDatabase();
