import { query } from '../config/db.js';

const checkAdminPermission = (requiredLevel = 'moderator') => {
    const levels = ['moderator', 'admin', 'super_admin'];

    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            const result = await query(`
                SELECT id, role as admin_level, is_active
                FROM admin_users 
                WHERE user_id = $1 AND is_active = true
            `, [userId]);

            if (result.rowCount === 0) {
                return res.status(403).json({ error: 'Access denied. Not an admin.' });
            }

            const admin = result.rows[0];
            const userLevelIndex = levels.indexOf(admin.admin_level);
            const requiredLevelIndex = levels.indexOf(requiredLevel);

            if (userLevelIndex < requiredLevelIndex) {
                return res.status(403).json({ error: `Insufficient privileges. Required: ${requiredLevel}` });
            }

            req.admin = admin;
            next();
        } catch (error) {
            console.error('Admin permission check failed:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

export default checkAdminPermission;
