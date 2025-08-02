// middlewares/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/issues';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `issue-${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    console.log('File filter check:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });

    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    console.log('File validation:', { extName, mimeType });

    if (extName && mimeType) {
        console.log('File accepted:', file.originalname);
        cb(null, true);
    } else {
        console.log('File rejected:', file.originalname);
        // Use cb(null, false) to reject file without throwing error
        const error = new Error('Only image files (jpeg, jpg, png, webp) are allowed');
        error.status = 400;
        cb(error, false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter
});

// Create a wrapper to handle multer errors properly
const handleMulterErrors = (uploadFunction) => {
    return (req, res, next) => {
        uploadFunction(req, res, (err) => {
            if (err) {
                console.log('Multer error caught:', {
                    code: err.code,
                    message: err.message,
                    stack: err.stack
                });

                // Handle different types of multer errors
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({ error: 'Too many files. Maximum 5 files allowed.' });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ error: 'Unexpected field name for file upload.' });
                }
                // Handle our custom file filter error
                if (err.message && err.message.includes('Only image files')) {
                    return res.status(400).json({ error: err.message });
                }
                // Handle other multer errors
                return res.status(400).json({ error: err.message || 'File upload error' });
            }
            console.log('File upload successful, proceeding to next middleware');
            next();
        });
    };
};

// Export wrapped upload functions
export default {
    single: (fieldName) => handleMulterErrors(upload.single(fieldName)),
    array: (fieldName, maxCount) => handleMulterErrors(upload.array(fieldName, maxCount)),
    fields: (fields) => handleMulterErrors(upload.fields(fields)),
    none: () => handleMulterErrors(upload.none())
};
