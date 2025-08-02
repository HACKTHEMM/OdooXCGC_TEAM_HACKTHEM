
// controllers/admin.controller.js

import { query } from '../config/db.js';

// GET /users - Get all users
export const getAllUsers = async (req, res) => {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const searchFilter = search ? `WHERE user_name ILIKE '%${search}%' OR email ILIKE '%${search}%'` : '';
        
        const result = await query(`
            SELECT id, user_name, email, is_banned, created_at, updated_at
            FROM users
            ${searchFilter}
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        const countResult = await query(`
            SELECT COUNT(*) as total
            FROM users
            ${searchFilter}
        `);

        res.json({
            users: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: Number(countResult.rows[0].total)
            }
        });
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// PATCH /users/:id/ban - Ban/unban user
export const banUser = async (req, res) => {
    const { id } = req.params;
    const { is_banned, ban_reason } = req.body;
    const adminId = req.user.id;

    try {
        const result = await query(`
            UPDATE users
            SET is_banned = $1, banned_at = ${is_banned ? 'CURRENT_TIMESTAMP' : 'NULL'}, ban_reason = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id, user_name, email, is_banned, banned_at, ban_reason
        `, [is_banned, ban_reason || null, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Log admin action
        await query(`
            INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, action_details)
            VALUES ($1, $2, 'user', $3, $4)
        `, [adminId, is_banned ? 'ban_user' : 'unban_user', id, JSON.stringify({ ban_reason })]);

        res.json({
            message: `User ${is_banned ? 'banned' : 'unbanned'} successfully`,
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Ban user error:', err);
        res.status(500).json({ error: 'Failed to update user ban status' });
    }
};

// GET /categories - Get all categories
export const getCategories = async (req, res) => {
    try {
        const result = await query(`
            SELECT id, name, description, color, icon, is_active, created_at, updated_at
            FROM categories
            ORDER BY name ASC
        `);

        res.json({ categories: result.rows });
    } catch (err) {
        console.error('Get categories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// POST /categories - Create new category
export const createCategory = async (req, res) => {
    const { name, description, color, icon } = req.body;
    const adminId = req.user.id;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const result = await query(`
            INSERT INTO categories (name, description, color, icon)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [name, description, color, icon]);

        // Log admin action
        await query(`
            INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, action_details)
            VALUES ($1, 'create_category', 'category', $2, $3)
        `, [adminId, result.rows[0].id, JSON.stringify({ name, description })]);

        res.status(201).json({ category: result.rows[0] });
    } catch (err) {
        console.error('Create category error:', err);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// PATCH /categories/:id - Update category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, color, icon, is_active } = req.body;
    const adminId = req.user.id;

    try {
        const result = await query(`
            UPDATE categories
            SET name = COALESCE($1, name),
                description = COALESCE($2, description),
                color = COALESCE($3, color),
                icon = COALESCE($4, icon),
                is_active = COALESCE($5, is_active),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `, [name, description, color, icon, is_active, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Log admin action
        await query(`
            INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, action_details)
            VALUES ($1, 'update_category', 'category', $2, $3)
        `, [adminId, id, JSON.stringify({ name, description, is_active })]);

        res.json({ category: result.rows[0] });
    } catch (err) {
        console.error('Update category error:', err);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// DELETE /categories/:id - Delete category
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    try {
        // Check if category has associated issues
        const issueCheck = await query(`
            SELECT COUNT(*) as count FROM issues WHERE category_id = $1
        `, [id]);

        if (Number(issueCheck.rows[0].count) > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete category with associated issues' 
            });
        }

        const result = await query(`
            DELETE FROM categories WHERE id = $1 RETURNING name
        `, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Log admin action
        await query(`
            INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, action_details)
            VALUES ($1, 'delete_category', 'category', $2, $3)
        `, [adminId, id, JSON.stringify({ name: result.rows[0].name })]);

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Delete category error:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

// GET /issues/flagged - Get flagged issues
export const getFlaggedIssues = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const result = await query(`
            SELECT DISTINCT i.id, i.title, i.description, i.flag_count, i.is_hidden,
                   c.name as category_name, u.user_name as reporter_name,
                   i.created_at, i.updated_at
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            JOIN users u ON i.reporter_id = u.id
            WHERE i.flag_count > 0
            ORDER BY i.flag_count DESC, i.updated_at DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        res.json({ flaggedIssues: result.rows });
    } catch (err) {
        console.error('Get flagged issues error:', err);
        res.status(500).json({ error: 'Failed to fetch flagged issues' });
    }
};

// PATCH /issues/:id/hide - Hide/unhide flagged issue
export const hideFlaggedIssue = async (req, res) => {
    const { id } = req.params;
    const { is_hidden, hide_reason } = req.body;
    const adminId = req.user.id;

    try {
        const result = await query(`
            UPDATE issues
            SET is_hidden = $1, hide_reason = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id, title, is_hidden, hide_reason
        `, [is_hidden, hide_reason || null, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        // Log admin action
        await query(`
            INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, action_details)
            VALUES ($1, $2, 'issue', $3, $4)
        `, [adminId, is_hidden ? 'hide_issue' : 'unhide_issue', id, JSON.stringify({ hide_reason })]);

        res.json({
            message: `Issue ${is_hidden ? 'hidden' : 'unhidden'} successfully`,
            issue: result.rows[0]
        });
    } catch (err) {
        console.error('Hide issue error:', err);
        res.status(500).json({ error: 'Failed to update issue visibility' });
    }
};

// DELETE /issues/:id/delete - Delete issue
export const deleteIssue = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    try {
        const issueResult = await query(`
            SELECT title FROM issues WHERE id = $1
        `, [id]);

        if (issueResult.rowCount === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        // Delete related data first
        await query(`DELETE FROM issue_comments WHERE issue_id = $1`, [id]);
        await query(`DELETE FROM issue_photos WHERE issue_id = $1`, [id]);
        await query(`DELETE FROM issue_flags WHERE issue_id = $1`, [id]);
        await query(`DELETE FROM issue_votes WHERE issue_id = $1`, [id]);
        await query(`DELETE FROM issue_status_log WHERE issue_id = $1`, [id]);
        
        // Delete the issue
        await query(`DELETE FROM issues WHERE id = $1`, [id]);

        // Log admin action
        await query(`
            INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, action_details)
            VALUES ($1, 'delete_issue', 'issue', $2, $3)
        `, [adminId, id, JSON.stringify({ title: issueResult.rows[0].title })]);

        res.json({ message: 'Issue deleted successfully' });
    } catch (err) {
        console.error('Delete issue error:', err);
        res.status(500).json({ error: 'Failed to delete issue' });
    }
};

// GET /analytics/summary - Get analytics summary
export const getAnalyticsSummary = async (req, res) => {
    try {
        const [usersCount, issuesCount, categoriesCount, flagsCount] = await Promise.all([
            query(`SELECT COUNT(*) as count FROM users`),
            query(`SELECT COUNT(*) as count FROM issues`),
            query(`SELECT COUNT(*) as count FROM categories WHERE is_active = true`),
            query(`SELECT COUNT(*) as count FROM issue_flags`)
        ]);

        const recentActivity = await query(`
            SELECT COUNT(*) as count FROM issues 
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        `);

        const topCategories = await query(`
            SELECT c.name, COUNT(i.id) as issue_count
            FROM categories c
            LEFT JOIN issues i ON c.id = i.category_id
            WHERE c.is_active = true
            GROUP BY c.id, c.name
            ORDER BY issue_count DESC
            LIMIT 5
        `);

        res.json({
            summary: {
                totalUsers: Number(usersCount.rows[0].count),
                totalIssues: Number(issuesCount.rows[0].count),
                totalCategories: Number(categoriesCount.rows[0].count),
                totalFlags: Number(flagsCount.rows[0].count),
                recentIssues: Number(recentActivity.rows[0].count),
                topCategories: topCategories.rows
            }
        });
    } catch (err) {
        console.error('Analytics summary error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
};
