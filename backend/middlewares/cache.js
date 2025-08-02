const cacheStore = new Map(); // In-memory store, swap with Redis as needed

const cacheMiddleware = (durationInSeconds = 60) => {
    return (req, res, next) => {
        const key = req.originalUrl;

        if (cacheStore.has(key)) {
            const cached = cacheStore.get(key);
            const now = Date.now();

            if (now - cached.timestamp < durationInSeconds * 1000) {
                return res.json(cached.data);
            } else {
                cacheStore.delete(key);
            }
        }

        // Capture response
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            cacheStore.set(key, { data, timestamp: Date.now() });
            originalJson(data);
        };

        next();
    };
};

export default cacheMiddleware;
