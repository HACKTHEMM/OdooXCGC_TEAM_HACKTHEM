
// app.js (Updated for Express 5)

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/db.js';

// Load environment variables
dotenv.config();

const app = express();

// Helpers to handle __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Optional: Request logging for development
// import morgan from 'morgan';
// app.use(morgan('dev'));

// Import routes
import userRoutes from './routes/user.routes.js';
import issueRoutes from './routes/issue.routes.js';
import adminRoutes from './routes/admin.routes.js';
import analyticsRoutes from './routes/admin.analytics.routes.js';
import locationRoutes from './routes/location.routes.js';
import notificationRoutes from './routes/notification.routes.js';

// Route mounting
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', analyticsRoutes); // Same base path
app.use('/api/locations', locationRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'OdooXCGC Team Hackthem API is running!',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            issues: '/api/issues',
            admin: '/api/admin',
            locations: '/api/locations',
            notifications: '/api/notifications'
        }
    });
});

// Health check route
app.get('/health', async (req, res) => {
    try {
        const dbStatus = await testConnection();
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: dbStatus ? 'connected' : 'disconnected',
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        path: req.originalUrl,
        availableRoutes: {
            users: '/api/users',
            issues: '/api/issues',
            admin: '/api/admin',
            locations: '/api/locations',
            notifications: '/api/notifications'
        }
    });
});

// Global error handler (Express 5 native)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Server Error',
    });
});

// Export the app instead of starting the server
export default app;
