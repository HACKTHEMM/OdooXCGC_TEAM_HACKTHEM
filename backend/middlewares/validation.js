import { body } from 'express-validator';

export const userValidation = [
    body('user_name').isLength({ min: 3 }).withMessage('Username too short'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password too short')
];

export const issueValidation = [
    body('title').notEmpty().withMessage('Title required'),
    body('description').notEmpty().withMessage('Description required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];
