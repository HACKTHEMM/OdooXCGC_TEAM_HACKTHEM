// Middleware for Category model
module.exports = {
  validateCategoryInput: (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    next();
  }
};
