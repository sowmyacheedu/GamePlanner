const express = require("express");
const router = express.Router();

const booking = require("../controllers/booking");
const check_auth = require("../middleware/check-auth");

//will need to add in auth eventually for checkout, success, failure, and pay

router.post("/activities", check_auth, booking.getActivities);
router.post("/slots", check_auth, booking.getSlots);
router.post("/createBooking", booking.createBooking);
router.get("/rooms/:activity", check_auth, booking.getRooms);
router.get("/equipment/:activity", check_auth, booking.getEquipment);
router.post("/price", check_auth, booking.getPrice);
router.get("/booking/:bid", booking.getBookingInfoExt);
router.post("/checkout", booking.checkout);
router.get("/success", booking.success);
router.get("/failure", booking.failure);
router.post("/pay", booking.pay);
router.get("/getUsers/:email", check_auth, booking.getFranchiseUsers);

module.exports = router;
