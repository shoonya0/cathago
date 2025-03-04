module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    // Handle different types of errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
            },
        });
    }

    // For programming or unknown errors
    res.status(500).json({
        error: {
            message: 'Internal Server Error',
        },
    });
};