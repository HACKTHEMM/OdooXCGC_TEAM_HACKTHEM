import { AdminUser } from '../models/index.js';

const checkAdminPermission = (requiredLevel = 'moderator') => {
    const levels = ['moderator', 'admin', 'super_admin'];

    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            const admin = await AdminUser.findOne({
                where: { user_id: userId, is_active: true }
            });

            if (!admin) {
                return res.status(403).json({ error: 'Access denied. Not an admin.' });
            }

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
