const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have an auth middleware

// Scan a document 
router.post('/scan', authMiddleware, scanController.scanDocument);

module.exports = router;