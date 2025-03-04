const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/userModel');
const ErrorHandler = require('../middlewares/errorHandler');

exports.register = (req, res) => {
    const { username, password } = req.body;

    // check if data is correct
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) {
            return res.status(500).send('Error registering user : \n' + err);
        }
        res.status(201).send('User registered successfully.');
    });
};

exports.login = (req, res) => {
const { username, password } = req.body;

    // check if data is correct
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(404).send('User not found : \n' + err);

        const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
        if (!passwordIsValid) return res.status(401).send('Invalid password.');

        const token = jwt.sign({ id: user.id, role: user.role }, 'secret', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
};