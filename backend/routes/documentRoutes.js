const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const authMiddleware = require("../middlewares/authMiddleware");

// Upload a document for scanning
router.post("/scanUpload", authMiddleware, documentController.uploadDocument);

// Get a matching documents
router.get("/matches/:docId", authMiddleware, documentController.matchDocument);

module.exports = router;
