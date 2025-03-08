const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/analytics", adminController.getAnalytics);
router.post("/approve-credit-requests", adminController.approveCreditRequest);

module.exports = router;
