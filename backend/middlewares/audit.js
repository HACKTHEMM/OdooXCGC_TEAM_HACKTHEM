import checkAdminPermission from './checkAdminPermission.js';

// Export admin level authorization checks
export const requireModerator = checkAdminPermission('moderator');
export const requireAdmin = checkAdminPermission('admin');
export const requireSuperAdmin = checkAdminPermission('super_admin');
