import { body, validationResult } from 'express-validator';

export const validateSignup = [
    body('user_name')
        .trim()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

export const validateLogin = [
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail().withMessage('Invalid email address'),
    body('password')
        .notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
