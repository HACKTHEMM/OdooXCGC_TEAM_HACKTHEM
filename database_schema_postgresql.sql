-- CivicTrack Database Schema for PostgreSQL
-- A comprehensive database design for civic issue reporting and tracking

-- Create extensions for spatial data and UUID generation
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing user information
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Create indexes for users table
CREATE INDEX idx_users_user_name ON users(user_name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification ON users(is_verified);
CREATE INDEX idx_users_banned ON users(is_banned);

-- Categories table for issue types
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    color_code VARCHAR(7), -- Hex color codes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for categories table
CREATE INDEX idx_categories_active ON categories(is_active);

-- Issue status types
CREATE TABLE issue_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color_code VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for issue_status table
CREATE INDEX idx_issue_status_active ON issue_status(is_active);
CREATE INDEX idx_issue_status_sort ON issue_status(sort_order);

-- Main issues table
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL DEFAULT 1, -- Default to 'Reported'
    reporter_id BIGINT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Location information (using PostGIS geometry)
    location GEOMETRY(POINT, 4326), -- WGS84 coordinate system
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    location_description VARCHAR(500),
    
    -- Tracking and moderation
    is_flagged BOOLEAN DEFAULT FALSE NOT NULL,
    flag_count SMALLINT DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    CONSTRAINT fk_issues_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_issues_status FOREIGN KEY (status_id) REFERENCES issue_status(id),
    CONSTRAINT fk_issues_reporter FOREIGN KEY (reporter_id) REFERENCES users(id)
);

-- Create indexes for issues table
CREATE INDEX idx_issues_location ON issues USING GIST(location);
CREATE INDEX idx_issues_lat_lng ON issues(latitude, longitude);
CREATE INDEX idx_issues_category ON issues(category_id);
CREATE INDEX idx_issues_status ON issues(status_id);
CREATE INDEX idx_issues_reporter ON issues(reporter_id);
CREATE INDEX idx_issues_created ON issues(created_at);
CREATE INDEX idx_issues_flagged ON issues(is_flagged);
CREATE INDEX idx_issues_hidden ON issues(is_hidden);
CREATE INDEX idx_issues_resolved ON issues(is_resolved);
CREATE INDEX idx_issues_category_status ON issues(category_id, status_id);
CREATE INDEX idx_issues_status_created ON issues(status_id, created_at);
CREATE INDEX idx_issues_category_created ON issues(category_id, created_at);

-- Trigger function to update the location geometry from lat/lng
CREATE OR REPLACE FUNCTION update_location_geometry()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update location geometry
CREATE TRIGGER trigger_update_location
    BEFORE INSERT OR UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_location_geometry();

-- Issue photos table (up to 3 photos per issue)
CREATE TABLE issue_photos (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    photo_order SMALLINT DEFAULT 1, -- 1, 2, or 3
    file_size INTEGER, -- in bytes
    mime_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_issue_photos_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    CONSTRAINT unique_issue_order UNIQUE (issue_id, photo_order)
);

-- Create indexes for issue_photos table
CREATE INDEX idx_issue_photos_issue ON issue_photos(issue_id);
CREATE INDEX idx_issue_photos_order ON issue_photos(photo_order);

-- Issue status change log for transparency
CREATE TABLE issue_status_log (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    old_status_id INTEGER,
    new_status_id INTEGER NOT NULL,
    changed_by BIGINT, -- admin/user who changed status
    change_reason TEXT,
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_status_log_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_status_log_old_status FOREIGN KEY (old_status_id) REFERENCES issue_status(id),
    CONSTRAINT fk_status_log_new_status FOREIGN KEY (new_status_id) REFERENCES issue_status(id),
    CONSTRAINT fk_status_log_changed_by FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Create indexes for issue_status_log table
CREATE INDEX idx_status_log_issue ON issue_status_log(issue_id);
CREATE INDEX idx_status_log_changed_at ON issue_status_log(changed_at);

-- User notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    issue_id BIGINT NOT NULL,
    notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('status_change', 'comment', 'flag', 'resolution')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

-- Create indexes for notifications table
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_issue ON notifications(issue_id);
CREATE INDEX idx_notifications_unread ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Issue flags/reports table for spam detection
CREATE TABLE issue_flags (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    flagger_id BIGINT NOT NULL,
    flag_reason VARCHAR(20) NOT NULL CHECK (flag_reason IN ('spam', 'inappropriate', 'duplicate', 'false_report', 'other')),
    flag_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_issue_flags_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_issue_flags_flagger FOREIGN KEY (flagger_id) REFERENCES users(id),
    CONSTRAINT unique_user_flag UNIQUE (issue_id, flagger_id) -- One flag per user per issue
);

-- Create indexes for issue_flags table
CREATE INDEX idx_issue_flags_issue ON issue_flags(issue_id);
CREATE INDEX idx_issue_flags_flagger ON issue_flags(flagger_id);
CREATE INDEX idx_issue_flags_reason ON issue_flags(flag_reason);

-- Admin users table
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    admin_level VARCHAR(20) NOT NULL DEFAULT 'moderator' CHECK (admin_level IN ('moderator', 'admin', 'super_admin')),
    permissions JSONB, -- Store specific permissions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT fk_admin_users_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_admin_users_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create indexes for admin_users table
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_admin_users_level ON admin_users(admin_level);

-- Admin actions log for audit trail
CREATE TABLE admin_actions (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('ban_user', 'unban_user', 'hide_issue', 'unhide_issue', 'delete_issue', 'resolve_flag')),
    target_type VARCHAR(10) NOT NULL CHECK (target_type IN ('user', 'issue', 'flag')),
    target_id BIGINT NOT NULL,
    reason TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_admin_actions_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);

-- Create indexes for admin_actions table
CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at);

-- User location tracking (for proximity-based filtering)
CREATE TABLE user_locations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    location GEOMETRY(POINT, 4326), -- WGS84 coordinate system
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_locations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for user_locations table
CREATE INDEX idx_user_locations_location ON user_locations USING GIST(location);
CREATE INDEX idx_user_locations_user ON user_locations(user_id);
CREATE INDEX idx_user_locations_primary ON user_locations(is_primary);

-- Trigger function to update user location geometry
CREATE OR REPLACE FUNCTION update_user_location_geometry()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user location geometry
CREATE TRIGGER trigger_update_user_location
    BEFORE INSERT OR UPDATE ON user_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_user_location_geometry();

-- Analytics and reporting tables
CREATE TABLE daily_analytics (
    id BIGSERIAL PRIMARY KEY,
    analytics_date DATE NOT NULL UNIQUE,
    total_issues_reported INTEGER DEFAULT 0,
    total_issues_resolved INTEGER DEFAULT 0,
    total_active_users INTEGER DEFAULT 0,
    most_reported_category_id INTEGER,
    avg_resolution_time_hours DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_daily_analytics_category FOREIGN KEY (most_reported_category_id) REFERENCES categories(id)
);

-- Create index for daily_analytics table
CREATE INDEX idx_daily_analytics_date ON daily_analytics(analytics_date);

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
    COUNT(CASE WHEN i.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as issues_last_30_days,
    u.created_at,
    u.last_login
FROM users u
LEFT JOIN issues i ON u.id = i.reporter_id AND i.is_hidden = FALSE
GROUP BY u.id, u.user_name, u.email, u.created_at, u.last_login;

-- Function to calculate distance between two points using PostGIS
CREATE OR REPLACE FUNCTION calculate_distance(lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN ST_Distance(
        ST_GeogFromText('POINT(' || lon1 || ' ' || lat1 || ')'),
        ST_GeogFromText('POINT(' || lon2 || ' ' || lat2 || ')')
    ) / 1000; -- Convert meters to kilometers
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby issues using PostGIS
CREATE OR REPLACE FUNCTION get_nearby_issues(
    user_lat DECIMAL,
    user_lon DECIMAL,
    radius_km DECIMAL,
    filter_category INTEGER DEFAULT NULL,
    filter_status INTEGER DEFAULT NULL,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE(
    id BIGINT,
    title VARCHAR(200),
    description TEXT,
    category_name VARCHAR(50),
    status_name VARCHAR(50),
    reporter_name VARCHAR(50),
    is_anonymous BOOLEAN,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address TEXT,
    distance_km DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        c.name as category_name,
        s.name as status_name,
        u.user_name as reporter_name,
        i.is_anonymous,
        i.latitude,
        i.longitude,
        i.address,
        ST_Distance(
            ST_GeogFromText('POINT(' || user_lon || ' ' || user_lat || ')'),
            ST_GeogFromText('POINT(' || i.longitude || ' ' || i.latitude || ')')
        ) / 1000 as distance_km,
        i.created_at,
        i.updated_at
    FROM issues i
    JOIN categories c ON i.category_id = c.id
    JOIN issue_status s ON i.status_id = s.id
    JOIN users u ON i.reporter_id = u.id
    WHERE 
        ST_DWithin(
            ST_GeogFromText('POINT(' || user_lon || ' ' || user_lat || ')'),
            ST_GeogFromText('POINT(' || i.longitude || ' ' || i.latitude || ')'),
            radius_km * 1000 -- Convert km to meters
        )
        AND (filter_category IS NULL OR i.category_id = filter_category)
        AND (filter_status IS NULL OR i.status_id = filter_status)
        AND i.is_hidden = FALSE
    ORDER BY distance_km ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update issue flag count
CREATE OR REPLACE FUNCTION update_flag_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE issues 
    SET flag_count = flag_count + 1,
        is_flagged = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.issue_id;
    
    -- Auto-hide issues with 5 or more flags
    UPDATE issues 
    SET is_hidden = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.issue_id AND flag_count >= 5;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update issue flag count
CREATE TRIGGER trigger_update_flag_count
    AFTER INSERT ON issue_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_flag_count();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status_id != NEW.status_id THEN
        INSERT INTO issue_status_log (issue_id, old_status_id, new_status_id, changed_at)
        VALUES (NEW.id, OLD.status_id, NEW.status_id, CURRENT_TIMESTAMP);
        
        -- Create notification for the reporter
        INSERT INTO notifications (user_id, issue_id, notification_type, title, message)
        VALUES (
            NEW.reporter_id,
            NEW.id,
            'status_change',
            'Issue Status Updated: ' || NEW.title,
            'Your reported issue status has been changed to: ' || 
            (SELECT name FROM issue_status WHERE id = NEW.status_id)
        );
    END IF;
    
    -- Update resolved timestamp
    IF NEW.status_id = 3 AND OLD.status_id != 3 THEN -- Status changed to 'Resolved'
        NEW.resolved_at = CURRENT_TIMESTAMP;
        NEW.is_resolved = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log status changes
CREATE TRIGGER trigger_log_status_change
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION log_status_change();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get issue statistics
CREATE OR REPLACE FUNCTION get_issue_statistics(days_back INTEGER DEFAULT 30)
RETURNS TABLE(
    total_issues BIGINT,
    resolved_issues BIGINT,
    in_progress_issues BIGINT,
    reported_issues BIGINT,
    avg_resolution_hours DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_issues,
        COUNT(CASE WHEN s.name = 'Resolved' THEN 1 END) as resolved_issues,
        COUNT(CASE WHEN s.name = 'In Progress' THEN 1 END) as in_progress_issues,
        COUNT(CASE WHEN s.name = 'Reported' THEN 1 END) as reported_issues,
        AVG(EXTRACT(EPOCH FROM (i.resolved_at - i.created_at)) / 3600)::DECIMAL as avg_resolution_hours
    FROM issues i
    JOIN issue_status s ON i.status_id = s.id
    WHERE i.created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    AND i.is_hidden = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance with spatial queries
CREATE INDEX idx_issues_location_gist ON issues USING GIST(location);
CREATE INDEX idx_user_locations_location_gist ON user_locations USING GIST(location);

-- Create a function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * days_to_keep
    AND is_read = TRUE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Performance Optimizations
-- Reduce page splits on frequently updated tables
ALTER TABLE issues SET (fillfactor = 70);
ALTER TABLE issue_photos SET (fillfactor = 70);

-- Partial indexes for common query filters
CREATE INDEX IF NOT EXISTS idx_issues_recent_visible ON issues (created_at) WHERE is_hidden = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_unread_filter ON notifications (user_id) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_user_locations_recent ON user_locations (user_id, updated_at);

-- Convert flag_count to smaller type for storage efficiency
ALTER TABLE issues ALTER COLUMN flag_count TYPE SMALLINT USING flag_count::SMALLINT;

-- Enforce NOT NULL on boolean flags for compact storage
ALTER TABLE issues ALTER COLUMN is_flagged SET NOT NULL;
ALTER TABLE issues ALTER COLUMN is_hidden SET NOT NULL;
ALTER TABLE issues ALTER COLUMN is_resolved SET NOT NULL;
