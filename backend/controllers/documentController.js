const db = require("../models/documentModel");
const creditManager = require("../utils/creditManager");
const textMatching = require("../utils/textMatching");
const fs = require("fs");

exports.uploadDocument = (req, res) => {
  const userId = req.session.user.id;

  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded or invalid file type" });
  }

  // Check if user has credits
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (!user || user.credits <= 0) {
      return res.status(403).json({ error: "No credits available" });
    }

    // Read file content
    fs.readFile(req.file.path, "utf8", (err, content) => {
      if (err) {
        return res.status(500).json({ error: "Error reading file" });
      }

      // Save document to database
      db.run(
        `
            INSERT INTO documents (user_id, filename, filepath, content)
            VALUES (?, ?, ?, ?)
          `,
        [userId, req.file.originalname, req.file.path, content],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Error saving document" });
          }

          const documentId = this.lastID;

          // Record the scan
          db.run(
            `
              INSERT INTO scans (user_id, document_id)
              VALUES (?, ?)
            `,
            [userId, documentId],
            (err) => {
              if (err) {
                return res.status(500).json({ error: "Error recording scan" });
              }

              // Deduct credit
              db.run(
                `
                UPDATE users
                SET credits = credits - 1
                WHERE id = ?
              `,
                [userId],
                (err) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ error: "Error updating user credits" });
                  }

                  // Find matching documents
                  db.all(
                    `
                  SELECT id, user_id, filename, content
                  FROM documents
                  WHERE id != ? AND user_id = ?
                `,
                    [documentId, userId],
                    (err, documents) => {
                      if (err) {
                        return res
                          .status(500)
                          .json({ error: "Error finding matches" });
                      }

                      // Calculate similarity for each document
                      const matches = documents.map((doc) => {
                        const similarity = calculateDocumentSimilarity(
                          content,
                          doc.content
                        );
                        return {
                          id: doc.id,
                          filename: doc.filename,
                          similarity: similarity,
                        };
                      });

                      // Sort by similarity (descending) and take top matches
                      const topMatches = matches
                        .filter((match) => match.similarity > 0.3) // Threshold for similarity
                        .sort((a, b) => b.similarity - a.similarity)
                        .slice(0, 5);

                      res.json({
                        message: "Document scanned successfully",
                        document: {
                          id: documentId,
                          filename: req.file.originalname,
                        },
                        matches: topMatches,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
};

exports.matchDocument = (req, res) => {
  const userId = req.session.user.id;
  const docId = req.params.docId;

  // Get the document
  db.get(
    `
        SELECT * FROM documents
        WHERE id = ? AND user_id = ?
      `,
    [docId, userId],
    (err, document) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Get all other documents from the user
      db.all(
        `
          SELECT id, filename, content
          FROM documents
          WHERE id != ? AND user_id = ?
        `,
        [docId, userId],
        (err, documents) => {
          if (err) {
            return res.status(500).json({ error: "Error finding matches" });
          }

          // Calculate similarity for each document
          const matches = documents.map((doc) => {
            const similarity = calculateDocumentSimilarity(
              document.content,
              doc.content
            );
            return {
              id: doc.id,
              filename: doc.filename,
              similarity: similarity,
            };
          });

          // Sort by similarity (descending) and take top matches
          const topMatches = matches
            .filter((match) => match.similarity > 0.3) // Threshold for similarity
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10);

          res.json({
            document: {
              id: document.id,
              filename: document.filename,
            },
            matches: topMatches,
          });
        }
      );
    }
  );
};
