const User = require("../models/User");
const Franchise = require("../models/Franchise");
const Company = require("../models/Company");
const Notification = require("../models/Notification");
const validation = require("./validation");

exports.sendNotification = async (req, res) => {
  console.log("Send Notification API Hit");
  const body = req.body;
  if(!body) return res.status(400).json({error: "Fill in Necessary Fields"});
  if(!body.email && !body.phoneNumber)  return res.status(400).json({error: "Email or Phone Number Required"});
  if(!body.date)  return res.status(400).json({error: "Date Required"});
  if(!body.time)  return res.status(400).json({error: "Time Required"});
  if(!body.content) return res.status(400).json({error: "Content Required"});
  var useEmail = body.email;
  var user = null; //the result from findOne for the user
  if (useEmail) {
    //attempts to find user based on email
    if (!validation.email(body.email))
      return res.status(400).json({ error: "Invalid Email Address" });
    user = await User.findOne({ email: body.email }).catch((err) => {
      return res.status(500).json({ error: err.message });
    });
  } else {
    //attempts to find user based on phone number
    if (!validation.phoneNumber(body.phoneNumber))
      return res.status(400).json({ error: "Invalid Phone Number" });
    user = await User.findOne({ phoneNumber: body.phoneNumber }).catch(
      (err) => {
        return res.status(500).json({ error: err.message });
      }
    );
  }
  if (user == null || !user._id) return res.status(404).json({ error: "User not found" });
  if(!validation.date(body.date))  return res.status(400).json({error: "Invalid Date"});
  if(!validation.time(body.time))  return res.status(400).json({error: "Invalid Time"});
  if(!validation.futureDateAndTime(body.date, body.time)) return res.status(400).json({error: "Date and Time Should Be In the Future"});
  if(typeof body.content !== "string") return res.status(400).json({error: "Invalid Content"});
  if (user.userType !== "Staff")
    return res.status(400).json({ error: "User is not Staff" });
  if (!user.franchise)
    return res
      .status(404)
      .json({ error: "Employee does not have associated Franchise" });
  const fran = await Franchise.findById(user.franchise).catch((err) => {
    return res.status(500).json({ error: err.message });
  }); //franchise
  if (!fran)
    return res.status(404).json({ error: "Employee franchise does not exist" });
  if (!fran.company)
    return res
      .status(404)
      .json({
        error: "Employee franchise does not have an associated company",
      });
  const comp = await Company.findById(fran.company).catch((err) => {
    return res.status(500).json({ error: err.message });
  }); //company
  if (!comp)
    return res.status(404).json({ error: "Employee's company does not exist" });
  const notification = new Notification({
    company: comp._id,
    date: body.date,
    time: body.time,
    content: body.content,
  });
  notification.save().catch((err) => {
    return res.status(500).json({ error: err.message });
  });
  return res.status(200).json({ success: true, msg: "Published"});
};
