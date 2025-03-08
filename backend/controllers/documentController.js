const db = require("../models/models");
const creditManager = require("../utils/creditManager");
const textMatching = require("../utils/textMatching");

exports.uploadDocument = (req, res) => {
  const userId = req.session.user.id;
  const token = req.session.token;

  let textFileData = "";

  req.on("data", (chunk) => {
    textFileData += chunk;
  });

  req.on("end", () => {
    const boundary = req.headers["content-type"].split("boundary=")[1];
    if (!boundary) {
      return res.status(400).send("No file uploaded - Invalid Content-Type");
    }
    // extract the text file data from the textFileData
    const parts = textFileData.split(`--${boundary}`);
    const filePart = parts.find((part) =>
      part.includes('Content-Disposition: form-data; name="document"')
    );

    if (!filePart) {
      return res.status(400).send("No file uploaded - Invalid Content-Type");
    }

    // Extract file content (after headers)
    const fileContentIndex = filePart.indexOf("\r\n\r\n") + 4;
    const fileContent = filePart.substring(
      fileContentIndex,
      filePart.lastIndexOf("\r\n")
    );

    // to find the file name
    const fileName = filePart.split("filename=")[1].split(".")[0];

    // save document to the database
    // Save document to database
    db.run(
      `INSERT INTO documents (user_id, filename, filepath, content) VALUES (?, ?, ?, ?)`,
      [userId, fileName, "../frontend/uploadFiles", fileContent],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Error saving document" });
        }
        const documentId = this.lastID;
        return res.status(200).json({
          message: "Document uploaded successfully",
          documentId: documentId,
        });
      }
    );
  });
};

exports.matchDocument = (req, res) => {
  const userId = req.session.user.id;
  const docId = req.params.docId;

  // Get the document
  db.get(
    `SELECT * FROM documents WHERE id = ? AND user_id = ?`,
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
        `SELECT id, filename, content FROM documents WHERE id != ? AND user_id = ?`,
        [docId, userId],
        (err, documents) => {
          if (err) {
            return res.status(500).json({ error: "Error finding matches" });
          }

          // Calculate similarity for each document
          const matches = textMatching.findSimilarDocuments(
            document.content,
            documents
          );
          // const matches = documents.map((doc) => {
          //   const similarity = textMatching.findSimilarDocuments(
          //     document.content,
          //     doc.content
          //   );
          //   return {
          //     id: doc.id,
          //     filename: doc.filename,
          //     similarity: similarity,
          //   };
          // });

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
