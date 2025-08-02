import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is required in environment variables');
    process.exit(1);
}

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is required in environment variables');
    process.exit(1);
}
