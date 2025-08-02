// Middleware for DailyAnalytics model
module.exports = {
  validateAnalyticsInput: (req, res, next) => {
    const { analyticsDate } = req.body;
    if (!analyticsDate) {
      return res.status(400).json({ error: 'analyticsDate is required.' });
    }
    next();
  }
};
