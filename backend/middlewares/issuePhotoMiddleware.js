// Middleware for IssuePhoto model
module.exports = {
  validatePhotoInput: (req, res, next) => {
    const { issueId, photoUrl } = req.body;
    if (!issueId || !photoUrl) {
      return res.status(400).json({ error: 'issueId and photoUrl are required.' });
    }
    next();
  }
};
