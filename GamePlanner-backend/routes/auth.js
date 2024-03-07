const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");
const check_auth = require("../middleware/check-auth");

router.post("/signup", auth.signup);
router.post("/signin", auth.signin);
router.put("/update", check_auth, auth.update);
router.post("/reset-password", auth.resetPassword);
router.post("/new-password", auth.newPassword);
router.post("/firebase-auth-signup", auth.firebaseAuthSignup);
router.post("/firebase-auth-signin", auth.firebaseAuthSignin);

module.exports = router;
