import xss from 'xss';

const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = xss(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    sanitize(req.body);
    sanitize(req.query);
    sanitize(req.params);

    next();
};

export default sanitizeInput;
