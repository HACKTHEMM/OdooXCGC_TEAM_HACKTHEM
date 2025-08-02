// Middleware for User model
module.exports = {
  validateUserInput: (req, res, next) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ error: 'userName, email, and password are required.' });
    }
    // Add more validation as needed
    next();
  },

  checkUserVerified: (req, res, next) => {
    if (!req.user || !req.user.isVerified) {
      return res.status(403).json({ error: 'User is not verified.' });
    }
    next();
  }
};
