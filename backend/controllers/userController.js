const db = require('../models/userModel');

// Get user profile and credits
exports.getUserProfile = (req, res) => {
    const userId = req.userId; // Assuming userId is set in the auth middleware

    db.get(`SELECT id, username, credits FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err || !user) return res.status(404).send('User not found.');
        res.status(200).json(user);
    });
};

// Get past scans for the user
exports.getUserScans = (req, res) => {
    const userId = req.userId; // Assuming userId is set in the auth middleware

    db.all(`SELECT * FROM documents WHERE user_id = ?`, [userId], (err, scans) => {
        if (err) return res.status(500).send('Error fetching scans.');
        res.status(200).json(scans);
    });
};