const db = require('../models/documentModel');
const creditManager = require('../utils/creditManager');
const textMatching = require('../utils/textMatching');

exports.uploadDocument = (req, res) => {
const { userId, content } = req.body;

creditManager.deductCredit(userId, (err) => {
    if (err) return res.status(400).send(err);

    db.run(`INSERT INTO documents (user_id, content) VALUES (?, ?)`, [userId, content], function(err) {
    if (err) return res.status(500).send('Error uploading document.');
    res.status(201).send('Document uploaded successfully.');
    });
});
};

exports.matchDocument = (req, res) => {
const { docId } = req.params;

// code for matching documents with the uploaded document remaining

db.get(`SELECT content FROM documents WHERE id = ?`, [docId], (err, document) => {
    if (err || !document) return res.status(404).send('Document not found.');

    // // Implement basic text matching logic here
    // res.status(200).send('Matching documents found.');

    db.all(`SELECT * FROM documents`, [], (err, allDocuments) => {
        if (err) return res.status(500).send('Error fetching documents.');

        const similarDocuments = textMatching.findSimilarDocuments(document.content, allDocuments);
        res.status(200).json(similarDocuments);
    });
});
};