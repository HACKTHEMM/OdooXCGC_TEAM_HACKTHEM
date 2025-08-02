// Update Category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, icon_url, color_code } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }
    try {
        const result = await query(`
            UPDATE categories SET name = $1, description = $2, icon_url = $3, color_code = $4
            WHERE id = $5 RETURNING *
        `, [name, description || null, icon_url || null, color_code || null, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category updated', category: result.rows[0] });
    } catch (err) {
        console.error('Update category error:', err);
        res.status(500).json({ error: 'Failed to update category' });
    }
};
// Hide Flagged Issue
export const hideFlaggedIssue = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(`
            UPDATE issues SET is_hidden = true WHERE id = $1 RETURNING id, title, is_hidden
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        res.json({ message: 'Issue hidden', issue: result.rows[0] });
    } catch (err) {
        console.error('Hide flagged issue error:', err);
        res.status(500).json({ error: 'Failed to hide issue' });
    }
};
// Get Flagged Issues
export const getFlaggedIssues = async (req, res) => {
    try {
        const result = await query(`
            SELECT i.*, f.reason, f.flagger_id, u.user_name AS flagger_name
            FROM issues i
            JOIN issue_flags f ON i.id = f.issue_id
            JOIN users u ON f.flagger_id = u.id
            WHERE i.is_hidden = false
            ORDER BY i.flag_count DESC, i.created_at DESC
            LIMIT 100
        `);
        res.json({ flaggedIssues: result.rows });
    } catch (err) {
        console.error('Get flagged issues error:', err);
        res.status(500).json({ error: 'Failed to fetch flagged issues' });
    }
};
// Get All Categories
export const getCategories = async (req, res) => {
    try {
        const result = await query(`
            SELECT * FROM categories ORDER BY name
        `);
        res.json({ categories: result.rows });
    } catch (err) {
        console.error('Get categories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
// Get Analytics Summary
export const getAnalyticsSummary = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM issues) AS total_issues,
                (SELECT COUNT(*) FROM issues WHERE is_hidden = false) AS active_issues,
                (SELECT COUNT(*) FROM issues WHERE is_hidden = true) AS hidden_issues,
                (SELECT COUNT(*) FROM categories) AS total_categories
        `);
        res.json({ summary: result.rows[0] });
    } catch (err) {
        console.error('Get analytics summary error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
};
// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const result = await query(`
            SELECT id, user_name, email, is_verified, is_banned, created_at, last_login
            FROM users
            ORDER BY created_at DESC
            LIMIT 200
        `);
        res.json({ users: result.rows });
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
// Delete Issue
export const deleteIssue = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(`
            DELETE FROM issues WHERE id = $1 RETURNING *
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        res.json({ message: 'Issue deleted', issue: result.rows[0] });
    } catch (err) {
        console.error('Delete issue error:', err);
        res.status(500).json({ error: 'Failed to delete issue' });
    }
};
// Delete Category
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(`
            DELETE FROM categories WHERE id = $1 RETURNING *
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted', category: result.rows[0] });
    } catch (err) {
        console.error('Delete category error:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
// Create Category
export const createCategory = async (req, res) => {
    const { name, description, icon_url, color_code } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }
    try {
        const result = await query(`
            INSERT INTO categories (name, description, icon_url, color_code)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [name, description || null, icon_url || null, color_code || null]);
        res.status(201).json({ category: result.rows[0] });
    } catch (err) {
        console.error('Create category error:', err);
        res.status(500).json({ error: 'Failed to create category' });
    }
};
// Ban User
export const banUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(`
            UPDATE users SET is_banned = true WHERE id = $1 RETURNING id, user_name, email, is_banned
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User banned', user: result.rows[0] });
    } catch (err) {
        console.error('Ban user error:', err);
        res.status(500).json({ error: 'Failed to ban user' });
    }
};

// controllers/issue.controller.js (Raw SQL Version)

import { query } from '../config/db.js';

// Upload Issue Photos
export const uploadIssuePhotos = async (req, res) => {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    try {
        const promises = files.map((file, index) =>
            query(`
                INSERT INTO issue_photos (issue_id, photo_url, photo_order, file_size, mime_type)
                VALUES ($1, $2, $3, $4, $5)
            `, [id, file.path, index + 1, file.size, file.mimetype])
        );

        await Promise.all(promises);
        res.status(201).json({ message: 'Photos uploaded successfully' });
    } catch (err) {
        console.error('Upload photos error:', err);
        res.status(500).json({ error: 'Failed to upload photos' });
    }
};

// Get Issue Photos
export const getIssuePhotos = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(`
            SELECT id, photo_url, photo_order, created_at
            FROM issue_photos WHERE issue_id = $1 ORDER BY photo_order
        `, [id]);

        res.json({ photos: result.rows });
    } catch (err) {
        console.error('Get photos error:', err);
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
};

// Add Comment
export const addComment = async (req, res) => {
    const { id } = req.params;
    const { comment_text } = req.body;

    if (!comment_text) {
        return res.status(400).json({ error: 'Comment text required' });
    }

    try {
        const result = await query(`
            INSERT INTO issue_comments (issue_id, user_id, comment_text)
            VALUES ($1, $2, $3)
            RETURNING id, comment_text, created_at
        `, [id, req.user.id, comment_text]);

        res.status(201).json({ comment: result.rows[0] });
    } catch (err) {
        console.error('Add comment error:', err);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

// Get Comments
export const getIssueComments = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(`
            SELECT c.id, c.comment_text, c.created_at, u.user_name
            FROM issue_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.issue_id = $1
            ORDER BY c.created_at ASC
        `, [id]);

        res.json({ comments: result.rows });
    } catch (err) {
        console.error('Get comments error:', err);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

// Upvote Issue
export const upvoteIssue = async (req, res) => {
    const { id } = req.params;

    try {
        await query(`
            INSERT INTO issue_votes (issue_id, user_id, vote_type)
            VALUES ($1, $2, 'upvote')
            ON CONFLICT (issue_id, user_id) DO UPDATE SET vote_type = 'upvote'
        `, [id, req.user.id]);

        res.json({ message: 'Upvoted successfully' });
    } catch (err) {
        console.error('Upvote error:', err);
        res.status(500).json({ error: 'Failed to upvote issue' });
    }
};

// Downvote Issue
export const downvoteIssue = async (req, res) => {
    const { id } = req.params;

    try {
        await query(`
            INSERT INTO issue_votes (issue_id, user_id, vote_type)
            VALUES ($1, $2, 'downvote')
            ON CONFLICT (issue_id, user_id) DO UPDATE SET vote_type = 'downvote'
        `, [id, req.user.id]);

        res.json({ message: 'Downvoted successfully' });
    } catch (err) {
        console.error('Downvote error:', err);
        res.status(500).json({ error: 'Failed to downvote issue' });
    }
};

// Get Status Log
export const getStatusLog = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(`
            SELECT l.id, l.old_status_id, l.new_status_id, l.change_reason,
                   l.changed_by, l.created_at,
                   s_old.name AS old_status_name,
                   s_new.name AS new_status_name
            FROM issue_status_log l
            JOIN issue_status s_old ON l.old_status_id = s_old.id
            JOIN issue_status s_new ON l.new_status_id = s_new.id
            WHERE l.issue_id = $1
            ORDER BY l.created_at DESC
        `, [id]);

        res.json({ statusLog: result.rows });
    } catch (err) {
        console.error('Status log error:', err);
        res.status(500).json({ error: 'Failed to fetch status log' });
    }
};

// Get Issues Map Pins
export const getIssuesMapPins = async (req, res) => {
    try {
        const result = await query(`
            SELECT id, latitude, longitude, title, category_id
            FROM issues
            WHERE is_hidden = false
            ORDER BY created_at DESC
            LIMIT 500
        `);

        res.json({ pins: result.rows });
    } catch (err) {
        console.error('Map pins error:', err);
        res.status(500).json({ error: 'Failed to fetch map pins' });
    }
};

// Get Nearby Issues
export const getNearbyIssues = async (req, res) => {
    const { lat, lng, radius_km = 5 } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const result = await query(`
            SELECT i.id, i.title, i.latitude, i.longitude, c.name AS category_name,
                   ST_Distance(
                       ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
                       ST_SetSRID(ST_MakePoint(i.longitude, i.latitude), 4326)::geography
                   ) / 1000 AS distance_km
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            WHERE i.is_hidden = false
            AND ST_DWithin(
                ST_SetSRID(ST_MakePoint(i.longitude, i.latitude), 4326)::geography,
                ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
                $3 * 1000
            )
            ORDER BY distance_km ASC
            LIMIT 100
        `, [lat, lng, radius_km]);

        res.json({ nearby: result.rows });
    } catch (err) {
        console.error('Nearby issues error:', err);
        res.status(500).json({ error: 'Failed to fetch nearby issues' });
    }
};