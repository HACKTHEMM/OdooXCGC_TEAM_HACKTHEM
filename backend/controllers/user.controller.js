import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, user_name: user.user_name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /register
export const registerUser = async (req, res) => {
    const { user_name, email, password } = req.body;

    try {
        const existing = await User.findByEmail(email);
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            userName: user_name,
            email,
            passwordHash: hashedPassword
        });

        const token = generateToken(newUser);
        res.status(201).json({ token, user: { id: newUser.id, email, user_name: newUser.user_name } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// POST /login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);
        await User.update(user.id, { last_login: new Date() });

        res.json({ token, user: { id: user.id, email, user_name: user.user_name } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// GET /me
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'user_name', 'email', 'is_verified', 'is_banned', 'created_at', 'last_login']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
