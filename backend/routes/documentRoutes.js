const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

// Upload a document for scanning
router.post("/scanUpload", documentController.uploadDocument);

// Get a matching documents
router.get("/matches/:docId", documentController.matchDocument);

module.exports = router;
