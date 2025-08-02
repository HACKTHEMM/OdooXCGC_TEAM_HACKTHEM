const ipRateLimitMap = new Map();

const rateLimit = (limit = 100, windowMs = 60 * 1000) => {
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();

        if (!ipRateLimitMap.has(ip)) {
            ipRateLimitMap.set(ip, []);
        }

        const timestamps = ipRateLimitMap.get(ip).filter(t => now - t < windowMs);
        timestamps.push(now);

        if (timestamps.length > limit) {
            return res.status(429).json({ error: 'Too many requests. Try again later.' });
        }

        ipRateLimitMap.set(ip, timestamps);
        next();
    };
};

export default rateLimit;
