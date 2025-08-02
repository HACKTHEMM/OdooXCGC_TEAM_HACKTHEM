// Middleware for Notification model
module.exports = {
  validateNotificationInput: (req, res, next) => {
    const { userId, issueId, notificationType, title, message } = req.body;
    if (!userId || !issueId || !notificationType || !title || !message) {
      return res.status(400).json({ error: 'userId, issueId, notificationType, title, and message are required.' });
    }
    next();
  }
};
