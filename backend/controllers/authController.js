const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/models");
const ErrorHandler = require("../middlewares/errorHandler");

exports.register = (req, res) => {
  const { username, password } = req.body;

  // check if data is correct
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (user) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(
      `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
      [username, hashedPassword],
      function (err) {
        if (err) {
          return res.status(500).send("Error registering user : \n" + err);
        }
        res.status(201).send("User registered successfully.");
      }
    );
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  // check if data is correct
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (!user) {
      return res.status(404).json({ error: "Invalid username or password." });
    }

    // compare password
    bcrypt.compare(password, user.password_hash, (err, match) => {
      if (err) {
        return res.status(500).json({ error: "Error comparing passwords" });
      }

      if (!match) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Set user session
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        token: (token = jwt.sign(
          { id: user.id, role: user.role, name: user.username },
          "secret",
          {
            expiresIn: Math.floor(Date.now() / 1000) + 86400,
          }
        )),
        // expiresIn: Math.floor(Date.now() / 1000) + 86400,
      };

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        token: token,
      });
    });
  });
};

// logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
};
