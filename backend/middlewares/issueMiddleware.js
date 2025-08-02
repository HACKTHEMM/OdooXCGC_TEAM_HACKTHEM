// Middleware for Issue model
module.exports = {
  validateIssueInput: (req, res, next) => {
    const { title, description, categoryId, latitude, longitude } = req.body;
    if (!title || !description || !categoryId || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'title, description, categoryId, latitude, and longitude are required.' });
    }
    next();
  },

  checkIssueOwnership: (req, res, next) => {
    if (req.issue && req.user && req.issue.reporterId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to modify this issue.' });
    }
    next();
  }
};
