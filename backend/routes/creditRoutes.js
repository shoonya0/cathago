const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.post("/request", authMiddleware, userController.requestCredit);

module.exports = router;
