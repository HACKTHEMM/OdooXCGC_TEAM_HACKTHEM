// middleware/auth.js
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'; // Sequelize model import

export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required', code: 'NO_TOKEN' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: { user_id: decoded.user_id, is_active: true },
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }

    req.user = user;
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { user_id: decoded.user_id, is_active: true },
      attributes: { exclude: ['password_hash'] },
    });

    req.user = user || null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

// Verify admin role
export const verifyAdmin = async (req, res, next) => {
  try {
    // First verify auth
    await verifyAuth(req, res, () => { });

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user is admin
    const { query } = await import('../config/db.js');
    const result = await query(`
      SELECT au.id, au.role
      FROM admin_users au
      WHERE au.user_id = $1 AND au.is_active = true
    `, [req.user.id]);

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = result.rows[0];
    next();
  } catch (err) {
    console.error('Admin verification error:', err);
    res.status(500).json({ error: 'Server error during admin verification' });
  }
};

// Verify admin or agent role
export const verifyAdminOrAgent = async (req, res, next) => {
  try {
    // First verify auth
    await verifyAuth(req, res, () => { });

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user is admin or agent
    const { query } = await import('../config/db.js');
    const result = await query(`
      SELECT au.id, au.role
      FROM admin_users au
      WHERE au.user_id = $1 AND au.is_active = true
      AND au.role IN ('admin', 'agent')
    `, [req.user.id]);

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Admin or agent access required' });
    }

    req.admin = result.rows[0];
    next();
  } catch (err) {
    console.error('Admin/Agent verification error:', err);
    res.status(500).json({ error: 'Server error during admin/agent verification' });
  }
};
