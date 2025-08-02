import { query } from '../config/db.js';

// GET /:id/locations
export const getUserLocations = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(`
            SELECT id, latitude, longitude, address, is_primary, created_at, updated_at
            FROM user_locations
            WHERE user_id = $1
            ORDER BY is_primary DESC, updated_at DESC
        `, [id]);

        res.json({ locations: result.rows });
    } catch (err) {
        console.error('Fetch user locations error:', err);
        res.status(500).json({ error: 'Failed to fetch user locations' });
    }
};

// POST /:id/locations
export const addUserLocation = async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, address, is_primary = false } = req.body;

    try {
        // Optional: If is_primary = true, unset others as primary
        if (is_primary) {
            await query(`
                UPDATE user_locations
                SET is_primary = false
                WHERE user_id = $1
            `, [id]);
        }

        const result = await query(`
            INSERT INTO user_locations (user_id, latitude, longitude, address, is_primary)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, latitude, longitude, address, is_primary, created_at
        `, [id, latitude, longitude, address, is_primary]);

        res.status(201).json({ location: result.rows[0] });
    } catch (err) {
        console.error('Add location error:', err);
        res.status(500).json({ error: 'Failed to add location' });
    }
};
