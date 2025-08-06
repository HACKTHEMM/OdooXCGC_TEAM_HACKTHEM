// models/index.js
import pool, { query, transaction } from '../config/db.js';

// User model functions
export const User = {
  // Create a new user
  async create(userData) {
    const { userName, email, phone, passwordHash, isVerified = false, isAnonymous = false } = userData;

    const result = await query(`
      INSERT INTO users (user_name, email, phone, password_hash, is_verified, is_anonymous)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_name, email, phone, is_verified, is_anonymous, created_at
    `, [userName, email, phone, passwordHash, isVerified, isAnonymous]);

    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await query(`
      SELECT * FROM users WHERE LOWER(email) = $1 AND is_banned = false
    `, [normalizedEmail]);

    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const result = await query(`
      SELECT id, user_name, email, phone, is_verified, is_anonymous, is_banned, created_at, updated_at, last_login
      FROM users WHERE id = $1
    `, [id]);

    return result.rows[0];
  },

  // Update user
  async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(`
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, user_name, email, phone, is_verified, is_anonymous, updated_at
    `, values);

    return result.rows[0];
  },

  // Get user statistics
  async getStatistics(userId) {
    const result = await query(`
      SELECT 
        u.id,
        u.user_name,
        u.email,
        COUNT(i.id) as total_issues_reported,
        COUNT(CASE WHEN i.is_resolved = TRUE THEN 1 END) as issues_resolved,
        COUNT(CASE WHEN i.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as issues_last_30_days,
        u.created_at,
        u.last_login
      FROM users u
      LEFT JOIN issues i ON u.id = i.reporter_id AND i.is_hidden = FALSE
      WHERE u.id = $1
      GROUP BY u.id, u.user_name, u.email, u.created_at, u.last_login
    `, [userId]);

    return result.rows[0];
  }
};

// Category model functions
export const Category = {
  // Get all active categories
  async findAll() {
    const result = await query(`
      SELECT * FROM categories WHERE is_active = true ORDER BY name
    `);

    return result.rows;
  },

  // Find category by ID
  async findById(id) {
    const result = await query(`
      SELECT * FROM categories WHERE id = $1 AND is_active = true
    `, [id]);

    return result.rows[0];
  },

  // Create new category
  async create(categoryData) {
    const { name, description, iconUrl, colorCode } = categoryData;

    const result = await query(`
      INSERT INTO categories (name, description, icon_url, color_code)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, description, iconUrl, colorCode]);

    return result.rows[0];
  }
};

// IssueStatus model functions
export const IssueStatus = {
  // Get all active statuses
  async findAll() {
    const result = await query(`
      SELECT * FROM issue_status WHERE is_active = true ORDER BY sort_order
    `);

    return result.rows;
  },

  // Find status by ID
  async findById(id) {
    const result = await query(`
      SELECT * FROM issue_status WHERE id = $1
    `, [id]);

    return result.rows[0];
  },

  // Get default status (Reported)
  async getDefault() {
    const result = await query(`
      SELECT * FROM issue_status WHERE name = 'Reported'
    `);

    return result.rows[0];
  }
};

// Issue model functions
export const Issue = {
  // Create new issue
  async create(issueData) {
    const {
      title, description, categoryId, reporterId, isAnonymous = false,
      latitude, longitude, address, locationDescription
    } = issueData;

    const result = await query(`
      INSERT INTO issues (
        title, description, category_id, reporter_id, is_anonymous,
        latitude, longitude, address, location_description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [title, description, categoryId, reporterId, isAnonymous, latitude, longitude, address, locationDescription]);

    return result.rows[0];
  },

  // Find issue by ID with details
  async findById(id) {
    const result = await query(`
      SELECT 
        i.*,
        c.name as category_name,
        c.color_code as category_color,
        s.name as status_name,
        s.color_code as status_color,
        u.user_name as reporter_name
      FROM issues i
      JOIN categories c ON i.category_id = c.id
      JOIN issue_status s ON i.status_id = s.id
      JOIN users u ON i.reporter_id = u.id
      WHERE i.id = $1 AND i.is_hidden = false
    `, [id]);

    return result.rows[0];
  },

  // Get nearby issues
  async findNearby(lat, lng, radiusKm = 5, options = {}) {
    const { categoryId, statusId, limit = 50 } = options;

    let whereClause = `
      ST_DWithin(
        ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
        location,
        $3 * 1000
      )
      AND i.is_hidden = false
    `;

    const params = [lat, lng, radiusKm];
    let paramCount = 4;

    if (categoryId) {
      whereClause += ` AND i.category_id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    if (statusId) {
      whereClause += ` AND i.status_id = $${paramCount}`;
      params.push(statusId);
      paramCount++;
    }

    params.push(limit);

    const result = await query(`
      SELECT 
        i.*,
        c.name as category_name,
        s.name as status_name,
        u.user_name as reporter_name,
        ST_Distance(
          ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
          i.location
        ) / 1000 as distance_km
      FROM issues i
      JOIN categories c ON i.category_id = c.id
      JOIN issue_status s ON i.status_id = s.id
      JOIN users u ON i.reporter_id = u.id
      WHERE ${whereClause}
      ORDER BY distance_km ASC
      LIMIT $${paramCount}
    `, params);

    return result.rows;
  },

  // Update issue status
  async updateStatus(id, statusId, changedBy = null, reason = null) {
    return await transaction(async (client) => {
      // Get current issue
      const currentIssue = await client.query(`
        SELECT * FROM issues WHERE id = $1
      `, [id]);

      if (!currentIssue.rows[0]) {
        throw new Error('Issue not found');
      }

      const oldStatusId = currentIssue.rows[0].status_id;

      // Update issue status
      const updatedIssue = await client.query(`
        UPDATE issues 
        SET status_id = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [statusId, id]);

      // Log status change
      await client.query(`
        INSERT INTO issue_status_log (issue_id, old_status_id, new_status_id, changed_by, change_reason)
        VALUES ($1, $2, $3, $4, $5)
      `, [id, oldStatusId, statusId, changedBy, reason]);

      // Create notification for reporter
      const statusName = await client.query(`
        SELECT name FROM issue_status WHERE id = $1
      `, [statusId]);

      await client.query(`
        INSERT INTO notifications (user_id, issue_id, notification_type, title, message)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        currentIssue.rows[0].reporter_id,
        id,
        'status_change',
        `Issue Status Updated: ${currentIssue.rows[0].title}`,
        `Your reported issue status has been changed to: ${statusName.rows[0].name}`
      ]);

      return updatedIssue.rows[0];
    });
  },

  // Get issues with pagination
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      statusId,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE i.is_hidden = false';
    const params = [];
    let paramCount = 1;

    if (categoryId) {
      whereClause += ` AND i.category_id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    if (statusId) {
      whereClause += ` AND i.status_id = $${paramCount}`;
      params.push(statusId);
      paramCount++;
    }

    if (search) {
      whereClause += ` AND (i.title ILIKE $${paramCount} OR i.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    params.push(limit, offset);

    const result = await query(`
      SELECT 
        i.*,
        c.name as category_name,
        c.color_code as category_color,
        s.name as status_name,
        s.color_code as status_color,
        u.user_name as reporter_name
      FROM issues i
      JOIN categories c ON i.category_id = c.id
      JOIN issue_status s ON i.status_id = s.id
      JOIN users u ON i.reporter_id = u.id
      ${whereClause}
      ORDER BY i.${sortBy} ${sortOrder}
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM issues i
      ${whereClause.replace(/\$\d+/g, (match, offset) => {
      const index = parseInt(match.slice(1)) - 1;
      return index < params.length - 2 ? match : '';
    }).replace('LIMIT.*', '')}
    `, params.slice(0, -2));

    return {
      issues: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }
};

// IssuePhoto model functions
export const IssuePhoto = {
  // Add photo to issue
  async create(photoData) {
    const { issueId, photoUrl, photoOrder, fileSize, mimeType } = photoData;

    const result = await query(`
      INSERT INTO issue_photos (issue_id, photo_url, photo_order, file_size, mime_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [issueId, photoUrl, photoOrder, fileSize, mimeType]);

    return result.rows[0];
  },

  // Get photos for issue
  async findByIssueId(issueId) {
    const result = await query(`
      SELECT * FROM issue_photos 
      WHERE issue_id = $1 
      ORDER BY photo_order
    `, [issueId]);

    return result.rows;
  }
};

// Notification model functions
export const Notification = {
  // Get user notifications
  async findByUserId(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = $1';
    const params = [userId];

    if (unreadOnly) {
      whereClause += ' AND is_read = false';
    }

    params.push(limit, offset);

    const result = await query(`
      SELECT * FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, params);

    return result.rows;
  },

  // Mark notification as read
  async markAsRead(id, userId) {
    const result = await query(`
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [id, userId]);

    return result.rows[0];
  }
};

// Export database instance
export { pool as db };