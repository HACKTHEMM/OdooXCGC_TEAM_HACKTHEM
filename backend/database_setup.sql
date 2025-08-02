-- Database setup script for OdooXCGC_TEAM_HACKTHEM

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    banned_at TIMESTAMP,
    ban_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- hex color
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issue status table
CREATE TABLE IF NOT EXISTS issue_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- hex color
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    status_id INTEGER REFERENCES issue_status(id) DEFAULT 1,
    reporter_id INTEGER REFERENCES users(id),
    is_anonymous BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false,
    hide_reason TEXT,
    flag_count INTEGER DEFAULT 0,
    upvote_count INTEGER DEFAULT 0,
    downvote_count INTEGER DEFAULT 0,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    location_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issue photos table
CREATE TABLE IF NOT EXISTS issue_photos (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    photo_order INTEGER DEFAULT 1,
    file_size INTEGER,
    mime_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issue comments table
CREATE TABLE IF NOT EXISTS issue_comments (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issue votes table
CREATE TABLE IF NOT EXISTS issue_votes (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(issue_id, user_id)
);

-- Issue flags table
CREATE TABLE IF NOT EXISTS issue_flags (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    flagger_id INTEGER REFERENCES users(id),
    flag_reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(issue_id, flagger_id)
);

-- Issue status log table
CREATE TABLE IF NOT EXISTS issue_status_log (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    old_status_id INTEGER REFERENCES issue_status(id),
    new_status_id INTEGER REFERENCES issue_status(id),
    change_reason TEXT,
    changed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    role VARCHAR(20) DEFAULT 'agent', -- agent, admin, super_admin
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin actions table
CREATE TABLE IF NOT EXISTS admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    action_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User locations table
CREATE TABLE IF NOT EXISTS user_locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily analytics table
CREATE TABLE IF NOT EXISTS daily_analytics (
    id SERIAL PRIMARY KEY,
    analytics_date DATE UNIQUE NOT NULL,
    total_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_issues INTEGER DEFAULT 0,
    new_issues INTEGER DEFAULT 0,
    resolved_issues INTEGER DEFAULT 0,
    flagged_issues INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description, color, icon) VALUES
('Roads', 'Potholes, obstructions, road damage', '#FF4444', 'road'),
('Lighting', 'Broken or flickering lights', '#FFAA00', 'lightbulb'),
('Water Supply', 'Leaks, low pressure, water issues', '#0099FF', 'water'),
('Cleanliness', 'Overflowing bins, garbage, littering', '#00AA44', 'trash'),
('Public Safety', 'Open manholes, exposed wiring, safety hazards', '#AA0000', 'warning'),
('Obstructions', 'Fallen trees, debris, blocked paths', '#8B4513', 'block')
ON CONFLICT (name) DO NOTHING;

-- Insert default issue statuses
INSERT INTO issue_status (name, description, color, sort_order) VALUES
('Reported', 'Issue has been reported and is pending review', '#FFA500', 1),
('In Progress', 'Issue is being worked on by authorities', '#0066CC', 2),
('Resolved', 'Issue has been resolved', '#00AA00', 3),
('Rejected', 'Issue was deemed invalid or duplicate', '#AA0000', 4),
('On Hold', 'Issue resolution is temporarily paused', '#808080', 5)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status_id);
CREATE INDEX IF NOT EXISTS idx_issues_reporter ON issues(reporter_id);
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at);
CREATE INDEX IF NOT EXISTS idx_issue_photos_issue ON issue_photos(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_issue ON issue_comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_votes_issue ON issue_votes(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_flags_issue ON issue_flags(issue_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_user ON user_locations(user_id);
