import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { JWT_SECRET } from '../config/env.js';

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, user_name: user.user_name },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /register
export const registerUser = async (req, res) => {
    const { user_name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await query(`
            SELECT id FROM users WHERE email = $1
        `, [email]);

        if (existingUser.rowCount > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(`
            INSERT INTO users (user_name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, user_name, email, created_at
        `, [user_name, email, hashedPassword]);

        const newUser = result.rows[0];
        const token = generateToken(newUser);

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                user_name: newUser.user_name
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// POST /login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await query(`
            SELECT id, user_name, email, password_hash, is_banned
            FROM users 
            WHERE email = $1
        `, [email]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        if (user.is_banned) {
            return res.status(403).json({ error: 'Account has been banned' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Update last login
        await query(`
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP 
            WHERE id = $1
        `, [user.id]);

        const token = generateToken(user);
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                user_name: user.user_name
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// GET /me
export const getMyProfile = async (req, res) => {
    try {
        const result = await query(`
            SELECT id, user_name, email, is_verified, is_banned, created_at, last_login
            FROM users 
            WHERE id = $1
        `, [req.user.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
