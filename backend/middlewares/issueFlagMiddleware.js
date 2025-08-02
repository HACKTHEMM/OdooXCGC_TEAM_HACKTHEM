// Middleware for IssueFlag model
module.exports = {
  validateFlagInput: (req, res, next) => {
    const { issueId, flaggerId, flagReason } = req.body;
    if (!issueId || !flaggerId || !flagReason) {
      return res.status(400).json({ error: 'issueId, flaggerId, and flagReason are required.' });
    }
    next();
  }
};
