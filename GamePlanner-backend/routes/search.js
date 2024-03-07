const express = require("express");
const router = express.Router();

const controller = require("../controllers/search");
const check_auth = require("../middleware/check-auth");

router.put("/franchisesByPrice", controller.franchisesByPrice);
router.put("/franchisesByDistance", controller.franchisesByDistance);
router.put("/popularFranchises", controller.popularFranchises);

module.exports = router;
