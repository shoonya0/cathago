const db = require("../models/userModel");

exports.getAnalytics = (req, res) => {
  db.all(
    `SELECT user_id, COUNT(*) as scan_count FROM documents GROUP BY user_id`,
    [],
    (err, scanData) => {
      if (err) return res.status(500).send("Error fetching analytics.");

      db.all(`SELECT * FROM users`, [], (err, users) => {
        if (err) return res.status(500).send("Error fetching users.");

        const analytics = {
          totalScans: scanData.length,
          users: users.map((user) => ({
            id: user.id,
            username: user.username,
            credits: user.credits,
            scanCount:
              scanData.find((scan) => scan.user_id === user.id)?.scan_count ||
              0,
          })),
        };

        res.status(200).json(analytics);
      });
    }
  );
};

exports.approveCreditRequest = (req, res) => {
  const { requestId } = req.body;

  db.run(
    `UPDATE credit_requests SET status = 'approved' WHERE id = ?`,
    [requestId],
    function (err) {
      if (err) return res.status(500).send("Error approving credit request.");
      res.status(200).send("Credit request approved.");
    }
  );
};
