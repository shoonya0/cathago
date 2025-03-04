const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    // const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        console.error('No token provided.');
        return res.redirect('/auth'); // Redirect to /auth if no token provided
    }
    
    if (!token) return res.redirect('/auth'); // Redirect to /auth if no token provided

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.redirect('/auth');
        }
        req.userId = decoded.id; // Save user ID for later use
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