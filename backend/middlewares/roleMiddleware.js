const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        console.error('No token provided.');
        return res.redirect('/auth'); // Redirect to /auth if no token provided
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token.');
        }

        // Check if the user role is admin
        if (decoded.role !== 'admin') {
            return res.status(403).send('Access denied. Admins only.');
        }

        next();
    });
};
