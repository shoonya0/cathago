const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        console.error('No token provided.');
        return res.redirect('/auth'); // Redirect to /auth if no token provided
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.redirect('/auth');
        }

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decoded.exp < currentTime) {
            console.warn('Token has expired. It will be reset after 24 hours.');
            return res.redirect('/auth'); // Redirect to /auth if token is expired
        }

        req.userId = decoded.id; // Save user ID for later use
        req.role = decoded.role;
        next();
    });
};




// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const token = req.headers['x-access-token'];

//     if (!token) return res.status(403).send('No token provided.');

//     jwt.verify(token, 'secret', (err, decoded) => {
//         if (err) return res.status(500).send('Failed to authenticate token.');

//         req.userId = decoded.id; // Save user ID for later use
//         next();
//     });
// };