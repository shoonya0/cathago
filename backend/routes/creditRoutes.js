const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.post("/request", adminController.approveCreditRequest);

module.exports = router;
