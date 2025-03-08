const db = require("../models/models");

exports.getAnalytics = (req, res) => {
  db.all(
    `SELECT user_id, COUNT(*) as scan_count FROM documents GROUP BY user_id`,
    [],
    (err, scanData) => {
      if (err) return res.status(500).send("Error fetching analytics.");

      db.all(`SELECT * FROM users`, [], (err, users) => {
        if (err) return res.status(500).send("Error fetching users.");

        // var analytics = {
        //   totalScans: scanData.length,
        //   users: users.map((user) => ({
        //     id: user.id,
        //     username: user.username,
        //     credits: user.credits,
        //     scanCount:
        //       scanData.find((scan) => scan.user_id === user.id)?.scan_count ||
        //       0,
        //   })),
        // };

        db.all(`SELECT * FROM credit_requests`, [], (err, creditRequests) => {
          if (err)
            return res.status(500).send("Error fetching credit requests.");
          analytics.creditRequests = creditRequests;
          res.status(200).json(analytics);
        });
      });
    }
  );
};

exports.approveCreditRequest = (req, res) => {
  // i want to get an array of all the credit requests that are going to be approved
  // and then update the status of the credit requests to approved
  // and then update the credits of the user
  const { requestIds } = req.body;
  db.run(
    `UPDATE credit_requests SET status = 'approved' WHERE id IN (${requestIds
      .map(() => "?")
      .join(",")})`,
    requestIds,
    (err) => {
      if (err) return res.status(500).send("Error approving credit requests.");
    }
  );
  db.run(
    `UPDATE users SET credits = credits + 20 WHERE id = ?`,
    [requestIds.length, requestIds[0]],
    (err) => {
      if (err) return res.status(500).send("Error updating user credits.");
    }
  );
  res.status(200).send("Credit requests approved.");
};
