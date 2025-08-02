import { sequelize } from '../models/index.js';

const checkSetup = async (req, res, next) => {
    try {
        await sequelize.authenticate();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ error: 'App setup issue. DB unreachable.' });
    }
};

export default checkSetup;
