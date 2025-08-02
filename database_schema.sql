-- CivicTrack Database Schema
-- A comprehensive database design for civic issue reporting and tracking

-- Users table for storing user information
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_user_name (user_name),
    INDEX idx_email (email),
    INDEX idx_verification (is_verified),
    INDEX idx_banned (is_banned)
);

-- Categories table for issue types
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    color_code VARCHAR(7), -- Hex color codes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active)
);

-- Issue status types
CREATE TABLE issue_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color_code VARCHAR(7),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
);

-- Main issues table
CREATE TABLE issues (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 1, -- Default to 'Reported'
    reporter_id BIGINT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Location information
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    location_description VARCHAR(500),
    
    -- Tracking and moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_count INT DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (status_id) REFERENCES issue_status(id),
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    
    -- Spatial index for location-based queries
    SPATIAL INDEX idx_location (POINT(latitude, longitude)),
    INDEX idx_category (category_id),
    INDEX idx_status (status_id),
    INDEX idx_reporter (reporter_id),
    INDEX idx_created (created_at),
    INDEX idx_flagged (is_flagged),
    INDEX idx_hidden (is_hidden),
    INDEX idx_resolved (is_resolved)
);

-- Issue photos table (up to 3 photos per issue)
CREATE TABLE issue_photos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    issue_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    photo_order TINYINT DEFAULT 1, -- 1, 2, or 3
    file_size INT, -- in bytes
    mime_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    
    INDEX idx_issue (issue_id),
    INDEX idx_order (photo_order),
    UNIQUE KEY unique_issue_order (issue_id, photo_order)
);

-- Issue status change log for transparency
CREATE TABLE issue_status_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    issue_id BIGINT NOT NULL,
    old_status_id INT,
    new_status_id INT NOT NULL,
    changed_by BIGINT, -- admin/user who changed status
    change_reason TEXT,
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (old_status_id) REFERENCES issue_status(id),
    FOREIGN KEY (new_status_id) REFERENCES issue_status(id),
    FOREIGN KEY (changed_by) REFERENCES users(id),
    
    INDEX idx_issue (issue_id),
    INDEX idx_changed_at (changed_at)
);

-- User notifications table
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    issue_id BIGINT NOT NULL,
    notification_type ENUM('status_change', 'comment', 'flag', 'resolution') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    
    INDEX idx_user (user_id),
    INDEX idx_issue (issue_id),
    INDEX idx_unread (is_read),
    INDEX idx_created (created_at)
);

-- Issue flags/reports table for spam detection
CREATE TABLE issue_flags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    issue_id BIGINT NOT NULL,
    flagger_id BIGINT NOT NULL,
    flag_reason ENUM('spam', 'inappropriate', 'duplicate', 'false_report', 'other') NOT NULL,
    flag_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (flagger_id) REFERENCES users(id),
    
    UNIQUE KEY unique_user_flag (issue_id, flagger_id), -- One flag per user per issue
    INDEX idx_issue (issue_id),
    INDEX idx_flagger (flagger_id),
    INDEX idx_reason (flag_reason)
);

-- Admin users table
CREATE TABLE admin_users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    admin_level ENUM('moderator', 'admin', 'super_admin') NOT NULL DEFAULT 'moderator',
    permissions JSON, -- Store specific permissions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    
    INDEX idx_active (is_active),
    INDEX idx_level (admin_level)
);

-- Admin actions log for audit trail
CREATE TABLE admin_actions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT NOT NULL,
    action_type ENUM('ban_user', 'unban_user', 'hide_issue', 'unhide_issue', 'delete_issue', 'resolve_flag') NOT NULL,
    target_type ENUM('user', 'issue', 'flag') NOT NULL,
    target_id BIGINT NOT NULL,
    reason TEXT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admin_users(id),
    
    INDEX idx_admin (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_target (target_type, target_id),
    INDEX idx_created (created_at)
);

-- User location tracking (for proximity-based filtering)
CREATE TABLE user_locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    SPATIAL INDEX idx_location (POINT(latitude, longitude)),
    INDEX idx_user (user_id),
    INDEX idx_primary (is_primary)
);

-- Analytics and reporting tables
CREATE TABLE daily_analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analytics_date DATE NOT NULL UNIQUE,
    total_issues_reported INT DEFAULT 0,
    total_issues_resolved INT DEFAULT 0,
    total_active_users INT DEFAULT 0,
    most_reported_category_id INT,
    avg_resolution_time_hours DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (most_reported_category_id) REFERENCES categories(id),
    
    INDEX idx_date (analytics_date)
);

-- Insert default categories
INSERT INTO categories (name, description, color_code) VALUES
('Roads', 'Potholes, obstructions, road damage', '#FF4444'),
('Lighting', 'Broken or flickering lights', '#FFAA00'),
('Water Supply', 'Leaks, low pressure, water issues', '#0099FF'),
('Cleanliness', 'Overflowing bins, garbage, littering', '#00AA44'),
('Public Safety', 'Open manholes, exposed wiring, safety hazards', '#AA0000'),
('Obstructions', 'Fallen trees, debris, blocked paths', '#8B4513');

-- Insert default issue statuses
INSERT INTO issue_status (name, description, color_code, sort_order) VALUES
('Reported', 'Issue has been reported and is pending review', '#FFA500', 1),
('In Progress', 'Issue is being worked on by authorities', '#0066CC', 2),
('Resolved', 'Issue has been resolved', '#00AA00', 3),
('Rejected', 'Issue was deemed invalid or duplicate', '#AA0000', 4),
('On Hold', 'Issue resolution is temporarily paused', '#808080', 5);

-- Create views for common queries

-- View for issues with full details
CREATE VIEW issues_detailed AS
SELECT 
    i.id,
    i.title,
    i.description,
    c.name as category_name,
    c.color_code as category_color,
    s.name as status_name,
    s.color_code as status_color,
    u.user_name as reporter_name,
    i.is_anonymous,
    i.latitude,
    i.longitude,
    i.address,
    i.flag_count,
    i.is_flagged,
    i.is_hidden,
    i.created_at,
    i.updated_at,
    i.resolved_at
FROM issues i
JOIN categories c ON i.category_id = c.id
JOIN issue_status s ON i.status_id = s.id
JOIN users u ON i.reporter_id = u.id
WHERE i.is_hidden = FALSE;

-- View for user statistics
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.user_name,
    u.email,
    COUNT(i.id) as total_issues_reported,
    COUNT(CASE WHEN i.is_resolved = TRUE THEN 1 END) as issues_resolved,
    COUNT(CASE WHEN i.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as issues_last_30_days,
    u.created_at,
    u.last_login
FROM users u
LEFT JOIN issues i ON u.id = i.reporter_id AND i.is_hidden = FALSE
GROUP BY u.id, u.user_name, u.email, u.created_at, u.last_login;

-- Indexes for performance optimization
-- Additional spatial indexes for proximity queries
ALTER TABLE issues ADD INDEX idx_lat_lng (latitude, longitude);

-- Composite indexes for common filtering
ALTER TABLE issues ADD INDEX idx_category_status (category_id, status_id);
ALTER TABLE issues ADD INDEX idx_status_created (status_id, created_at);
ALTER TABLE issues ADD INDEX idx_category_created (category_id, created_at);

-- Function to calculate distance between two points (Haversine formula)
DELIMITER //
CREATE FUNCTION calculate_distance(lat1 DECIMAL(10,8), lon1 DECIMAL(11,8), lat2 DECIMAL(10,8), lon2 DECIMAL(11,8))
RETURNS DECIMAL(10,3)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE distance DECIMAL(10,3);
    SET distance = (
        6371 * ACOS(
            COS(RADIANS(lat1)) * 
            COS(RADIANS(lat2)) * 
            COS(RADIANS(lon2) - RADIANS(lon1)) + 
            SIN(RADIANS(lat1)) * 
            SIN(RADIANS(lat2))
        )
    );
    RETURN distance;
END//
DELIMITER ;

-- Stored procedure to get nearby issues
DELIMITER //
CREATE PROCEDURE GetNearbyIssues(
    IN user_lat DECIMAL(10,8),
    IN user_lon DECIMAL(11,8),
    IN radius_km DECIMAL(10,3),
    IN filter_category INT,
    IN filter_status INT,
    IN limit_count INT
)
BEGIN
    SELECT 
        i.*,
        c.name as category_name,
        s.name as status_name,
        calculate_distance(user_lat, user_lon, i.latitude, i.longitude) as distance_km
    FROM issues_detailed i
    JOIN categories c ON i.category_name = c.name
    JOIN issue_status s ON i.status_name = s.name
    WHERE 
        calculate_distance(user_lat, user_lon, i.latitude, i.longitude) <= radius_km
        AND (filter_category IS NULL OR c.id = filter_category)
        AND (filter_status IS NULL OR s.id = filter_status)
        AND i.is_hidden = FALSE
    ORDER BY distance_km ASC
    LIMIT limit_count;
END//
DELIMITER ;

-- Trigger to update issue flag count
DELIMITER //
CREATE TRIGGER update_flag_count
AFTER INSERT ON issue_flags
FOR EACH ROW
BEGIN
    UPDATE issues 
    SET flag_count = flag_count + 1,
        is_flagged = TRUE
    WHERE id = NEW.issue_id;
    
    -- Auto-hide issues with 5 or more flags
    UPDATE issues 
    SET is_hidden = TRUE 
    WHERE id = NEW.issue_id AND flag_count >= 5;
END//
DELIMITER ;

-- Trigger to log status changes
DELIMITER //
CREATE TRIGGER log_status_change
AFTER UPDATE ON issues
FOR EACH ROW
BEGIN
    IF OLD.status_id != NEW.status_id THEN
        INSERT INTO issue_status_log (issue_id, old_status_id, new_status_id, changed_at)
        VALUES (NEW.id, OLD.status_id, NEW.status_id, NOW());
        
        -- Create notification for the reporter
        INSERT INTO notifications (user_id, issue_id, notification_type, title, message)
        VALUES (
            NEW.reporter_id,
            NEW.id,
            'status_change',
            CONCAT('Issue Status Updated: ', NEW.title),
            CONCAT('Your reported issue status has been changed to: ', 
                   (SELECT name FROM issue_status WHERE id = NEW.status_id))
        );
    END IF;
    
    -- Update resolved timestamp
    IF NEW.status_id = 3 AND OLD.status_id != 3 THEN -- Status changed to 'Resolved'
        UPDATE issues SET resolved_at = NOW(), is_resolved = TRUE WHERE id = NEW.id;
    END IF;
END//
DELIMITER ;
