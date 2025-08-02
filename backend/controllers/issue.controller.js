// Update Issue Status
export const updateIssueStatus = async (req, res) => {
    const { id } = req.params;
    const { new_status_id, change_reason } = req.body;
    const changed_by = req.user.id;
    if (!new_status_id) {
        return res.status(400).json({ error: 'New status ID is required' });
    }
    try {
        // Get current status
        const current = await query('SELECT status_id FROM issues WHERE id = $1', [id]);
        if (current.rows.length === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        const old_status_id = current.rows[0].status_id;
        // Update status
        await query('UPDATE issues SET status_id = $1 WHERE id = $2', [new_status_id, id]);
        // Log status change
        await query(`
            INSERT INTO issue_status_log (issue_id, old_status_id, new_status_id, change_reason, changed_by)
            VALUES ($1, $2, $3, $4, $5)
        `, [id, old_status_id, new_status_id, change_reason || null, changed_by]);
        res.json({ message: 'Issue status updated' });
    } catch (err) {
        console.error('Update issue status error:', err);
        res.status(500).json({ error: 'Failed to update issue status' });
    }
};
// Get All Issues
export const getIssues = async (req, res) => {
    try {
        const result = await query(`
            SELECT i.*, c.name AS category_name, u.user_name AS reporter_name
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            JOIN users u ON i.reporter_id = u.id
            WHERE i.is_hidden = false
            ORDER BY i.created_at DESC
            LIMIT 100
        `);
        res.json({ issues: result.rows });
    } catch (err) {
        console.error('Get issues error:', err);
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
};
// Get Issue By ID
export const getIssueById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(`
            SELECT i.*, c.name AS category_name, u.user_name AS reporter_name
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            JOIN users u ON i.reporter_id = u.id
            WHERE i.id = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        res.json({ issue: result.rows[0] });
    } catch (err) {
        console.error('Get issue by ID error:', err);
        res.status(500).json({ error: 'Failed to fetch issue' });
    }
};
// Flag Issue
export const flagIssue = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({ error: 'Flag reason is required' });
    }

    try {
        // Insert a flag for the issue by this user
        await query(`
            INSERT INTO issue_flags (issue_id, flagger_id, reason)
            VALUES ($1, $2, $3)
            ON CONFLICT (issue_id, flagger_id) DO NOTHING
        `, [id, userId, reason]);

        // Optionally increment flag count on the issue
        await query(`
            UPDATE issues SET flag_count = COALESCE(flag_count, 0) + 1 WHERE id = $1
        `, [id]);

        res.status(201).json({ message: 'Issue flagged for review' });
    } catch (err) {
        console.error('Flag issue error:', err);
        res.status(500).json({ error: 'Failed to flag issue' });
    }
};
// controllers/issue.controller.js (Raw SQL Version)

import { query } from '../config/db.js';

// Create Issue
export const createIssue = async (req, res) => {
    const { title, description, category_id, latitude, longitude, address, location_description, is_anonymous } = req.body;
    const reporter_id = req.user.id;

    if (!title || !description || !category_id) {
        return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    try {
        const result = await query(`
            INSERT INTO issues (
                title, description, category_id, reporter_id, is_anonymous,
                latitude, longitude, address, location_description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [
            title, description, category_id, reporter_id, is_anonymous || false,
            latitude, longitude, address, location_description
        ]);

        res.status(201).json({ issue: result.rows[0] });
    } catch (err) {
        console.error('Create issue error:', err);
        res.status(500).json({ error: 'Failed to create issue' });
    }
};

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
