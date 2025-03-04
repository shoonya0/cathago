const db = require('../models/userModel');

exports.deductCredit = (userId, callback) => {
db.get(`SELECT credits FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err || !user) return callback('User not found.');

        if (user.credits > 0) {
        db.run(`UPDATE users SET credits = credits - 1 WHERE id = ?`, [userId], (err) => {
            if (err) return callback('Error deducting credit.');
            callback(null);
        });
        } else {
        callback('Insufficient credits.');
        }
    });
};