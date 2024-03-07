const express = require("express");
const router = express.Router();

const dash_profile = require("../controllers/dash_profile");

const check_auth = require("../middleware/check-auth");

router.get("/user/:email", check_auth, dash_profile.getUserDetails);
router.post("/manageDash", check_auth, dash_profile.getManagementDetails);
router.put("/dropdown/company", check_auth, dash_profile.companyDrop);
router.put("/dropdown/franchise", check_auth, dash_profile.franchiseDrop);
router.put("/dropdown/state", check_auth, dash_profile.stateDrop);
router.put("/dropdown/city", check_auth, dash_profile.cityDrop);
router.post('/membershipUpdate', dash_profile.updateMembership);
router.post('/membershipCheckout', dash_profile.membershipCheckout);

module.exports = router;
