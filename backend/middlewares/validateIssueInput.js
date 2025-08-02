import { body, validationResult } from 'express-validator';

const validateIssueInput = [
    body('title')
        .notEmpty().withMessage('Title is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    body('category_id')
        .isInt({ gt: 0 }).withMessage('Valid category_id is required'),
    body('latitude')
        .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be valid'),
    body('longitude')
        .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be valid'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default validateIssueInput;
