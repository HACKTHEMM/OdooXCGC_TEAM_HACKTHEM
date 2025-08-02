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
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
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
            success: true,
            data: {
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    user_name: newUser.user_name
                }
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error during registration'
        });
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
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const user = result.rows[0];

        if (user.is_banned) {
            return res.status(403).json({
                success: false,
                error: 'Account has been banned'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }

        // Update last login
        await query(`
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP 
            WHERE id = $1
        `, [user.id]);

        const token = generateToken(user);
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    user_name: user.user_name
                }
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error during login'
        });
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
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /create-admin - Create admin role for a user
export const createAdminRole = async (req, res) => {
    const { user_id, admin_level = 'moderator', permissions } = req.body;

    try {
        // Validate admin_level
        const validLevels = ['moderator', 'admin', 'super_admin'];
        if (!validLevels.includes(admin_level)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid admin level. Must be one of: moderator, admin, super_admin'
            });
        }

        // Check if user exists
        const userExists = await query(`
            SELECT id FROM users WHERE id = $1
        `, [user_id]);

        if (userExists.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check if user is already an admin
        const existingAdmin = await query(`
            SELECT id FROM admin_users WHERE user_id = $1
        `, [user_id]);

        if (existingAdmin.rowCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'User is already an admin'
            });
        }

        // Create admin role
        const result = await query(`
            INSERT INTO admin_users (user_id, admin_level, permissions, created_by)
            VALUES ($1, $2, $3, $4)
            RETURNING id, user_id, admin_level, permissions, created_at, is_active
        `, [user_id, admin_level, permissions ? JSON.stringify(permissions) : null, req.user?.id || null]);

        const newAdmin = result.rows[0];

        // Get user details for response
        const userDetails = await query(`
            SELECT u.id, u.user_name, u.email, au.admin_level, au.permissions, au.created_at as admin_created_at
            FROM users u
            JOIN admin_users au ON u.id = au.user_id
            WHERE u.id = $1
        `, [user_id]);

        res.status(201).json({
            success: true,
            message: 'Admin role created successfully',
            data: userDetails.rows[0]
        });
    } catch (err) {
        console.error('Create admin role error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error while creating admin role'
        });
    }
};

// PATCH /update-admin-role/:id - Update admin role/permissions
export const updateAdminRole = async (req, res) => {
    const { id } = req.params;
    const { admin_level, permissions, is_active } = req.body;

    try {
        // Check if admin exists
        const adminExists = await query(`
            SELECT id, user_id FROM admin_users WHERE id = $1
        `, [id]);

        if (adminExists.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Admin record not found'
            });
        }

        // Build update query dynamically
        let updateFields = [];
        let values = [];
        let paramCount = 1;

        if (admin_level !== undefined) {
            const validLevels = ['moderator', 'admin', 'super_admin'];
            if (!validLevels.includes(admin_level)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid admin level. Must be one of: moderator, admin, super_admin'
                });
            }
            updateFields.push(`admin_level = $${paramCount++}`);
            values.push(admin_level);
        }

        if (permissions !== undefined) {
            updateFields.push(`permissions = $${paramCount++}`);
            values.push(permissions ? JSON.stringify(permissions) : null);
        }

        if (is_active !== undefined) {
            updateFields.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }

        values.push(id);

        const result = await query(`
            UPDATE admin_users 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, user_id, admin_level, permissions, is_active
        `, values);

        // Get updated user details
        const userDetails = await query(`
            SELECT u.id, u.user_name, u.email, au.admin_level, au.permissions, au.is_active
            FROM users u
            JOIN admin_users au ON u.id = au.user_id
            WHERE au.id = $1
        `, [id]);

        res.json({
            success: true,
            message: 'Admin role updated successfully',
            data: userDetails.rows[0]
        });
    } catch (err) {
        console.error('Update admin role error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error while updating admin role'
        });
    }
};

// DELETE /remove-admin/:id - Remove admin role
export const removeAdminRole = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if admin exists
        const adminExists = await query(`
            SELECT id, user_id FROM admin_users WHERE id = $1
        `, [id]);

        if (adminExists.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Admin record not found'
            });
        }

        const userId = adminExists.rows[0].user_id;

        // Remove admin role
        await query(`
            DELETE FROM admin_users WHERE id = $1
        `, [id]);

        // Get user details for response
        const userDetails = await query(`
            SELECT id, user_name, email FROM users WHERE id = $1
        `, [userId]);

        res.json({
            success: true,
            message: 'Admin role removed successfully',
            data: userDetails.rows[0]
        });
    } catch (err) {
        console.error('Remove admin role error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error while removing admin role'
        });
    }
};

// GET /check-admin-status/:id - Check if user has admin role
export const checkAdminStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(`
            SELECT u.id, u.user_name, u.email, au.admin_level, au.permissions, au.is_active, au.created_at as admin_created_at
            FROM users u
            LEFT JOIN admin_users au ON u.id = au.user_id
            WHERE u.id = $1
        `, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const userData = result.rows[0];
        const isAdmin = userData.admin_level !== null;

        res.json({
            success: true,
            data: {
                ...userData,
                is_admin: isAdmin
            }
        });
    } catch (err) {
        console.error('Check admin status error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error while checking admin status'
        });
    }
};
