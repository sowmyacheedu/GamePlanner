const express = require("express");
const router = express.Router();

const controller = require("../controllers/notify");
const check_auth = require("../middleware/check-auth");

router.post("/send", check_auth, controller.sendNotification);

module.exports = router;
