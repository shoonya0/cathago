const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware"); // Assuming you have an auth middleware

// Get user profile and credits
router.get("/profile", authMiddleware, userController.getUserProfile);

// Get past scans for the user
// router.get('/scans', authMiddleware, userController.getUserScans);

module.exports = router;
