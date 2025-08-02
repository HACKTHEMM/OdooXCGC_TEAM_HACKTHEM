// Middleware for AdminUser and AdminAction models
module.exports = {
  requireAdmin: (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required.' });
    }
    next();
  },

  validateAdminAction: (req, res, next) => {
    const { actionType, targetType, targetId } = req.body;
    if (!actionType || !targetType || !targetId) {
      return res.status(400).json({ error: 'actionType, targetType, and targetId are required.' });
    }
    next();
  }
};
