const db = require("../models/userModel");

// Get user profile and credits
exports.getUserProfile = (req, res) => {
  const userId = req.session.userId;
  db.get(
    `SELECT id, username, credits, last_credit_reset FROM users WHERE id = ?`,
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      //   get user profile data
      db.all(
        `SELECT * FROM documents WHERE user_id = ?`,
        [userId],
        (err, documents) => {
          res.status(200).json({
            user: {
              id: user.id,
              username: user.username,
              credits: user.credits,
              last_credit_reset: user.last_credit_reset,
            },
            documents: documents,
          });
        }
      );
    }
  );
};

// Get past scans for the user
exports.getUserScans = (req, res) => {
  const userId = req.userId; // Assuming userId is set in the auth middleware

  db.all(
    `SELECT * FROM documents WHERE user_id = ?`,
    [userId],
    (err, scans) => {
      if (err) return res.status(500).send("Error fetching scans.");
      res.status(200).json(scans);
    }
  );
};
