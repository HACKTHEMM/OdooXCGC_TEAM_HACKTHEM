import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
console.log('from env db url', process.env.DATABASE_URL)
export const DATABASE_URL = "postgres://postgres:123@localhost:5432/odoo"
