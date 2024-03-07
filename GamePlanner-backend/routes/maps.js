const express = require("express");
const router = express.Router();

const maps = require("../controllers/maps");
const check_auth = require("../middleware/check-auth");

//will need to add in auth eventually for checkout, success, failure, and pay

router.get("/markers", maps.getMarkerInfo)
module.exports = router;
