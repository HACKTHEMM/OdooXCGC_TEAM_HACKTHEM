// Middleware for UserLocation model
module.exports = {
  validateUserLocationInput: (req, res, next) => {
    const { userId, latitude, longitude } = req.body;
    if (!userId || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'userId, latitude, and longitude are required.' });
    }
    next();
  }
};
