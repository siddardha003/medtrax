const errorHandler = (err, req, res, next) => {
    // Prevent duplicate error responses
    if (res.headersSent) {
        console.log('⚠️  Headers already sent, skipping duplicate error response');
        return next(err);
    }

    let error = { ...err };
    error.message = err.message;

    // Log error for debugging with session info if available
    const sessionInfo = req.loginSessionId ? ` (Session: ${req.loginSessionId})` : '';
    console.error(`❌ Error${sessionInfo}:`, err.message);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = {
            message,
            statusCode: 404
        };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
        error = {
            message,
            statusCode: 400
        };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = {
            message,
            statusCode: 400
        };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = {
            message,
            statusCode: 401
        };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = {
            message,
            statusCode: 401
        };
    }

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'File too large';
        error = {
            message,
            statusCode: 400
        };
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        const message = 'Too many files';
        error = {
            message,
            statusCode: 400
        };
    }

    // Rate limiting errors
    if (err.message && err.message.includes('Too many requests')) {
        error = {
            message: 'Too many requests, please try again later',
            statusCode: 429
        };
    }

    // Enhanced error response with duplicate protection
    try {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    } catch (responseError) {
        console.error('⚠️  Error sending error response:', responseError.message);
    }
};

module.exports = errorHandler;
