import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        // Check database connection
        const dbCheck = await db.query('SELECT 1');

        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

export default router;
