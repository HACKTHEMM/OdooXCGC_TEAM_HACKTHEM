// middleware/auth.js
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { JWT_SECRET } from '../config/env.js';

export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required', code: 'NO_TOKEN' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await query(`
      SELECT id, user_name, email, is_verified, is_banned, created_at
      FROM users 
      WHERE id = $1 AND is_banned = false
    `, [decoded.id]);

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: message, code: err.name });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await query(`
      SELECT id, user_name, email, is_verified, is_banned, created_at
      FROM users 
      WHERE id = $1 AND is_banned = false
    `, [decoded.id]);

    req.user = result.rowCount > 0 ? result.rows[0] : null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

// Verify admin role
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user details
    const { query } = await import('../config/db.js');
    const userResult = await query(`
      SELECT id, user_name, email, is_banned, is_verified
      FROM users
      WHERE id = $1 AND is_banned = false
    `, [decoded.id]);

    if (userResult.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    req.user = userResult.rows[0];

    // Check if user is admin
    const adminResult = await query(`
      SELECT au.id, au.role
      FROM admin_users au
      WHERE au.user_id = $1 AND au.is_active = true
    `, [req.user.id]);

    if (adminResult.rowCount === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = adminResult.rows[0];
    next();
  } catch (err) {
    console.error('Admin verification error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Server error during admin verification' });
  }
};

// Verify admin or agent role
export const verifyAdminOrAgent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user details
    const { query } = await import('../config/db.js');
    const userResult = await query(`
      SELECT id, user_name, email, is_banned, is_verified
      FROM users
      WHERE id = $1 AND is_banned = false
    `, [decoded.id]);

    if (userResult.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    req.user = userResult.rows[0];

    // Check if user is admin or agent
    const adminResult = await query(`
      SELECT au.id, au.role
      FROM admin_users au
      WHERE au.user_id = $1 AND au.is_active = true
    `, [req.user.id]);

    if (adminResult.rowCount === 0) {
      return res.status(403).json({ error: 'Admin or agent access required' });
    }

    req.admin = adminResult.rows[0];
    next();
  } catch (err) {
    console.error('Admin/Agent verification error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Server error during admin/agent verification' });
  }
};
