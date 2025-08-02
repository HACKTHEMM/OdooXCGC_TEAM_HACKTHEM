
// app.js (Updated for Express 5)

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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
    res.send('API is running...');
});

// Global error handler (Express 5 native)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Server Error',
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
