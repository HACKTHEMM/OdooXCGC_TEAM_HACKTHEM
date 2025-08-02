// controllers/issue.controller.js (Raw SQL Version)

import { query } from '../config/db.js';

// GET /issues - Get all issues with filters
export const getIssues = async (req, res) => {
    const {
        page = 1,
        limit = 20,
        category_id,
        status_id,
        search,
        sort_by = 'created_at',
        sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    try {
        let whereConditions = ['i.is_hidden = false'];
        let params = [];
        let paramCount = 0;

        if (category_id) {
            paramCount++;
            whereConditions.push(`i.category_id = $${paramCount}`);
            params.push(category_id);
        }

        if (status_id) {
            paramCount++;
            whereConditions.push(`i.status_id = $${paramCount}`);
            params.push(status_id);
        }

        if (search) {
            paramCount++;
            whereConditions.push(`(i.title ILIKE $${paramCount} OR i.description ILIKE $${paramCount})`);
            params.push(`%${search}%`);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        paramCount++;
        params.push(limit);
        paramCount++;
        params.push(offset);

        const result = await query(`
            SELECT 
                i.id, i.title, i.description, i.category_id, i.status_id,
                i.reporter_id, i.is_anonymous, i.flag_count, i.upvote_count, 
                i.downvote_count, i.latitude, i.longitude, i.address,
                i.location_description, i.created_at, i.updated_at,
                c.name as category_name, c.color as category_color,
                s.name as status_name, s.color as status_color,
                CASE WHEN i.is_anonymous = true THEN 'Anonymous' ELSE u.user_name END as reporter_name
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            JOIN issue_status s ON i.status_id = s.id
            LEFT JOIN users u ON i.reporter_id = u.id
            ${whereClause}
            ORDER BY i.${sort_by} ${sort_order}
            LIMIT $${paramCount - 1} OFFSET $${paramCount}
        `, params);

        // Get photos for all issues
        const issueIds = result.rows.map(issue => issue.id);
        let photosMap = {};

        if (issueIds.length > 0) {
            const photosResult = await query(`
                SELECT issue_id, id, photo_url, photo_order, file_size, mime_type
                FROM issue_photos 
                WHERE issue_id = ANY($1)
                ORDER BY issue_id, photo_order ASC
            `, [issueIds]);

            // Group photos by issue_id
            photosResult.rows.forEach(photo => {
                if (!photosMap[photo.issue_id]) {
                    photosMap[photo.issue_id] = [];
                }
                photosMap[photo.issue_id].push(photo);
            });
        }

        // Add photos to each issue
        const issuesWithPhotos = result.rows.map(issue => ({
            ...issue,
            photos: photosMap[issue.id] || []
        }));

        // Get total count for pagination
        const countResult = await query(`
            SELECT COUNT(*) as total
            FROM issues i
            ${whereClause}
        `, params.slice(0, -2)); // Remove limit and offset for count

        res.json({
            success: true,
            data: {
                data: issuesWithPhotos,
                total: Number(countResult.rows[0].total),
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit))
            }
        });
    } catch (err) {
        console.error('Get issues error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch issues'
        });
    }
};

// GET /issues/:id - Get single issue by ID
export const getIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(`
            SELECT 
                i.id, i.title, i.description, i.category_id, i.status_id,
                i.reporter_id, i.is_anonymous, i.flag_count, i.upvote_count, 
                i.downvote_count, i.latitude, i.longitude, i.address,
                i.location_description, i.created_at, i.updated_at,
                c.name as category_name, c.color as category_color, c.icon as category_icon,
                s.name as status_name, s.color as status_color,
                CASE WHEN i.is_anonymous = true THEN 'Anonymous' ELSE u.user_name END as reporter_name,
                CASE WHEN i.is_anonymous = true THEN NULL ELSE u.email END as reporter_email
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            JOIN issue_status s ON i.status_id = s.id
            LEFT JOIN users u ON i.reporter_id = u.id
            WHERE i.id = $1 AND i.is_hidden = false
        `, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Issue not found'
            });
        }

        // Get photos for this issue
        const photosResult = await query(`
            SELECT id, photo_url, photo_order, file_size, mime_type
            FROM issue_photos 
            WHERE issue_id = $1 
            ORDER BY photo_order ASC
        `, [id]);

        // Combine issue data with photos
        const issueData = result.rows[0];
        issueData.photos = photosResult.rows;

        res.json({
            success: true,
            data: issueData
        });
    } catch (err) {
        console.error('Get issue by ID error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch issue'
        });
    }
};

// PATCH /issues/:id/status - Update issue status
export const updateIssueStatus = async (req, res) => {
    const { id } = req.params;
    const { status_id, change_reason } = req.body;
    const changedBy = req.user.id;

    if (!status_id) {
        return res.status(400).json({ error: 'Status ID is required' });
    }

    try {
        // Get current status for logging
        const currentIssue = await query(`
            SELECT status_id FROM issues WHERE id = $1
        `, [id]);

        if (currentIssue.rowCount === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        const oldStatusId = currentIssue.rows[0].status_id;

        // Update issue status
        const result = await query(`
            UPDATE issues
            SET status_id = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, status_id
        `, [status_id, id]);

        // Log status change
        await query(`
            INSERT INTO issue_status_log (issue_id, old_status_id, new_status_id, change_reason, changed_by)
            VALUES ($1, $2, $3, $4, $5)
        `, [id, oldStatusId, status_id, change_reason || 'Status updated by admin/agent', changedBy]);

        res.json({
            message: 'Issue status updated successfully',
            issue: result.rows[0]
        });
    } catch (err) {
        console.error('Update issue status error:', err);
        res.status(500).json({ error: 'Failed to update issue status' });
    }
};

// POST /issues/:id/flag - Flag an issue
export const flagIssue = async (req, res) => {
    const { id } = req.params;
    const { flag_reason } = req.body;
    const flaggerId = req.user.id;

    if (!flag_reason) {
        return res.status(400).json({ error: 'Flag reason is required' });
    }

    try {
        // Check if user already flagged this issue
        const existingFlag = await query(`
            SELECT id FROM issue_flags WHERE issue_id = $1 AND flagger_id = $2
        `, [id, flaggerId]);

        if (existingFlag.rowCount > 0) {
            return res.status(400).json({ error: 'You have already flagged this issue' });
        }

        // Add flag
        await query(`
            INSERT INTO issue_flags (issue_id, flagger_id, flag_reason)
            VALUES ($1, $2, $3)
        `, [id, flaggerId, flag_reason]);

        // Update flag count
        const result = await query(`
            UPDATE issues
            SET flag_count = flag_count + 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING flag_count
        `, [id]);

        res.status(201).json({
            message: 'Issue flagged successfully',
            flag_count: result.rows[0].flag_count
        });
    } catch (err) {
        console.error('Flag issue error:', err);
        res.status(500).json({ error: 'Failed to flag issue' });
    }
};

// Create Issue
export const createIssue = async (req, res) => {
    const { title, description, category_id, latitude, longitude, address, location_description, is_anonymous } = req.body;
    const reporter_id = req.user.id;
    const files = req.files; // Get uploaded files

    if (!title || !description || !category_id) {
        return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    // Parse form data values to proper types
    const parsedCategoryId = parseInt(category_id);
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
    const parsedIsAnonymous = is_anonymous === 'true' || is_anonymous === true;

    // Validate parsed values
    if (isNaN(parsedCategoryId) || isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
        return res.status(400).json({ error: 'Invalid category_id, latitude, or longitude' });
    }

    try {
        // First create the issue
        const result = await query(`
            INSERT INTO issues (
                title, description, category_id, reporter_id, is_anonymous,
                latitude, longitude, address, location_description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [
            title, description, parsedCategoryId, reporter_id, parsedIsAnonymous,
            parsedLatitude, parsedLongitude, address, location_description
        ]);

        const issueId = result.rows[0].id;

        // Handle photo uploads if any files were provided
        if (files && files.length > 0) {
            const photoPromises = files.map((file, index) => {
                // Convert file system path to complete URL
                const fullUrl = `http://localhost:${process.env.PORT || 8000}/uploads/issues/${file.filename}`;

                return query(`
                    INSERT INTO issue_photos (issue_id, photo_url, photo_order, file_size, mime_type)
                    VALUES ($1, $2, $3, $4, $5)
                `, [issueId, fullUrl, index + 1, file.size, file.mimetype]);
            });

            await Promise.all(photoPromises);
        }

        // Fetch the complete issue data with photos
        const completeIssueResult = await query(`
            SELECT 
                i.id, i.title, i.description, i.category_id, i.status_id,
                i.reporter_id, i.is_anonymous, i.flag_count, i.upvote_count, 
                i.downvote_count, i.latitude, i.longitude, i.address,
                i.location_description, i.created_at, i.updated_at,
                c.name as category_name, c.color as category_color, c.icon as category_icon,
                s.name as status_name, s.color as status_color,
                CASE WHEN i.is_anonymous = true THEN 'Anonymous' ELSE u.user_name END as reporter_name,
                CASE WHEN i.is_anonymous = true THEN NULL ELSE u.email END as reporter_email
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            JOIN issue_status s ON i.status_id = s.id
            LEFT JOIN users u ON i.reporter_id = u.id
            WHERE i.id = $1
        `, [issueId]);

        // Get photos for the created issue
        const photosResult = await query(`
            SELECT id, photo_url, photo_order, file_size, mime_type
            FROM issue_photos 
            WHERE issue_id = $1 
            ORDER BY photo_order ASC
        `, [issueId]);

        // Combine issue data with photos
        const issueData = completeIssueResult.rows[0];
        issueData.photos = photosResult.rows;

        res.status(201).json({
            success: true,
            data: issueData
        });
    } catch (err) {
        console.error('Create issue error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to create issue'
        });
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
        const promises = files.map((file, index) => {
            // Convert file system path to complete URL
            const fullUrl = `http://localhost:${process.env.PORT || 8000}/uploads/issues/${file.filename}`;

            return query(`
                INSERT INTO issue_photos (issue_id, photo_url, photo_order, file_size, mime_type)
                VALUES ($1, $2, $3, $4, $5)
            `, [id, fullUrl, index + 1, file.size, file.mimetype]);
        });

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

// GET /issues/stats - Get public statistics (no authentication required)
export const getPublicStats = async (req, res) => {
    try {
        // Get basic issue statistics
        const totalIssuesResult = await query('SELECT COUNT(*) as count FROM issues WHERE is_hidden = false');
        const resolvedIssuesResult = await query(`
            SELECT COUNT(*) as count 
            FROM issues i
            JOIN issue_status s ON i.status_id = s.id
            WHERE i.is_hidden = false AND s.name = 'resolved'
        `);
        const pendingIssuesResult = await query(`
            SELECT COUNT(*) as count 
            FROM issues i
            JOIN issue_status s ON i.status_id = s.id
            WHERE i.is_hidden = false AND s.name IN ('open', 'in_progress')
        `);

        // Get popular categories (top 5)
        const popularCategoriesResult = await query(`
            SELECT c.name as category_name, COUNT(i.id) as issue_count
            FROM categories c
            LEFT JOIN issues i ON c.id = i.category_id AND i.is_hidden = false
            GROUP BY c.id, c.name
            ORDER BY issue_count DESC
            LIMIT 5
        `);

        // Get recent activity (last 10 issues)
        const recentActivityResult = await query(`
            SELECT 
                i.title,
                c.name as category_name,
                s.name as status_name,
                i.created_at
            FROM issues i
            JOIN categories c ON i.category_id = c.id
            JOIN issue_status s ON i.status_id = s.id
            WHERE i.is_hidden = false
            ORDER BY i.created_at DESC
            LIMIT 10
        `);

        const stats = {
            totalIssues: parseInt(totalIssuesResult.rows[0].count),
            resolvedIssues: parseInt(resolvedIssuesResult.rows[0].count),
            pendingIssues: parseInt(pendingIssuesResult.rows[0].count),
            totalUsers: 0, // Not exposing user counts for privacy
            activeUsers: 0, // Not exposing user counts for privacy
            popularCategories: popularCategoriesResult.rows,
            recentActivity: recentActivityResult.rows
        };

        res.json({ success: true, data: stats });
    } catch (err) {
        console.error('Public stats error:', err);
        res.status(500).json({ error: 'Failed to fetch public statistics' });
    }
};

// GET /categories - Get public categories (no authentication required)
export const getPublicCategories = async (req, res) => {
    try {
        const result = await query(`
            SELECT id, name, description, color, icon, is_active, created_at
            FROM categories
            WHERE is_active = true
            ORDER BY name ASC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Get public categories error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
};
