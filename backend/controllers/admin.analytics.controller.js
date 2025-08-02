import { query } from '../config/db.js';

// GET /analytics/daily
export const getDailyAnalytics = async (req, res) => {
    try {
        const result = await query(`
            SELECT * FROM daily_analytics
            ORDER BY analytics_date DESC
            LIMIT 30
        `);

        res.json({ analytics: result.rows });
    } catch (err) {
        console.error('Daily analytics error:', err);
        res.status(500).json({ error: 'Failed to fetch daily analytics' });
    }
};

// GET /actions
export const getAdminActions = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                a.*,
                u.user_name as admin_name,
                u.email as admin_email
            FROM admin_actions a
            JOIN admin_users au ON a.admin_id = au.id
            JOIN users u ON au.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 100
        `);

        res.json({ actions: result.rows });
    } catch (err) {
        console.error('Admin actions fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch admin actions' });
    }
};

// GET /flags
export const getAllFlags = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                f.*,
                i.title as issue_title,
                i.flag_count,
                u.user_name as flagger_name,
                u.email as flagger_email
            FROM issue_flags f
            JOIN issues i ON f.issue_id = i.id
            JOIN users u ON f.flagger_id = u.id
            ORDER BY f.created_at DESC
            LIMIT 100
        `);

        res.json({ flags: result.rows });
    } catch (err) {
        console.error('Issue flags fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch issue flags' });
    }
};
