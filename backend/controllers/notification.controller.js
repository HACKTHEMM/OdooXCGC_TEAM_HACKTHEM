import { query } from '../config/db.js';

// GET /notifications?unread=true&page=1&limit=20
export const getNotifications = async (req, res) => {
    const userId = req.user.id;
    const { unread = false, page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;
    const unreadFilter = unread === 'true' ? 'AND is_read = false' : '';

    try {
        const result = await query(`
            SELECT id, issue_id, notification_type, title, message, is_read, created_at, read_at
            FROM notifications
            WHERE user_id = $1 ${unreadFilter}
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        res.json({ notifications: result.rows, page: Number(page) });
    } catch (err) {
        console.error('Fetch notifications error:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// PATCH /notifications/:id/read
export const markNotificationRead = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const result = await query(`
            UPDATE notifications
            SET is_read = true, read_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING id, is_read, read_at
        `, [id, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification marked as read', notification: result.rows[0] });
    } catch (err) {
        console.error('Mark read error:', err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
};
