const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require('stripe')("sk_test_51Mui3bHcIO95vaZ7w1NMF2DE7uAcUSfPwydNMQ2bMyQWznKLJgexS3XrBU5Csy8QOMAkN1B280jsYZ2ribaarsNS00BMpW7x00");

const emailSender = require("../config/sendEmail");
const validation = require("./validation");
const User = require("../models/User");
const Franchise = require("../models/Franchise");
const Company = require("../models/Company");

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const phoneNumberRegexexp =
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

exports.signin = async (req, res) => {
  console.log("SignIn API was hit");
  let reqBody = req.body;
  let errors = [];
  if (!reqBody.email && !reqBody.phoneNumber) {
    errors.push("Email or Phone Number is Required");
  }
  if (reqBody.email && !emailRegexp.test(reqBody.email)) {
    errors.push("Invalid Email");
  }
  if (reqBody.phoneNumber && !phoneNumberRegexexp.test(reqBody.phoneNumber)) {
    errors.push("Invalid Phone Number");
  }
  if (!reqBody.password) {
    errors.push("Password is Required");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  const useEmail = reqBody.email;
  var user = null; //the result from findOne for the user
  if (useEmail) {
    //attempts to find user based on email
    user = await User.findOne({ email: reqBody.email }).catch((err) => {
      return res.status(500).json({ error: err.message });
    });
  } else {
    //attempts to find user based on phone number
    user = await User.findOne({ phoneNumber: reqBody.phoneNumber }).catch(
      (err) => {
        return res.status(500).json({ error: err.message });
      }
    );
  }
  if (user == null || !user._id) return res.status(404).json({ error: "User not found" });
  if (user.authType !== "email")
  return res.status(404).json({
    error: "Invalid login! User registered via OAuth",
  });
    bcrypt
      .compare(reqBody.password, user.password)
      .then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({
            error: "Incorrect Password",
          });
        } else {
          const token = jwt.sign(
            { id: user.id, email: user.email },
            "gameplanner_secretkey",
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            success: true,
            data: {
              email: user.email,
              phoneNumber: user.phoneNumber,
              userType: user.userType,
              token: token,
            },
          });
        }
      })
      .catch((err) => {
        res
          .status(401)
          .json({ error: "Verification Error", msg: err.message });
      });
};

exports.signup = async (req, res) => {
  let reqBody = req.body;
  let errors = [];
  if (!reqBody.firstName) {
    errors.push("First Name is Required");
  }
  if (!reqBody.lastName) {
    errors.push("Last Name is Required");
  }
  if (!reqBody.email) {
    errors.push("Email is Required");
  } else if (!emailRegexp.test(reqBody.email)) {
    errors.push("Email is Invalid");
  }
  if (!reqBody.phoneNumber) {
    errors.push("Phone Number is Required");
  } else if (!phoneNumberRegexexp.test(reqBody.phoneNumber)) {
    errors.push("Phone Number is Invalid");
  }
  if (!reqBody.password) {
    errors.push("Password is Invalid");
  }
  if (!reqBody.passwordConfirmation) {
    errors.push("Password Confirmation is Required");
  } else if (reqBody.password !== reqBody.passwordConfirmation) {
    errors.push("Password Confirmation Does Not Match Password");
  }
  if (!reqBody.franchise) {
    errors.push("Franchise Required");
  } else {
    await Franchise.findById(reqBody.franchise).catch(() => {
      errors.push("Franchise Not Found");
    });
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  const altUser = await User.findOne({$or: [{ email: reqBody.email }, { phoneNumber: reqBody.phoneNumber }]});
  if(altUser != null && altUser._id)  return res.status(400).json({ error: "email or phoneNumber already exists" });
  const cust = await stripe.customers.create({
    email: reqBody.email,
    phone: reqBody.phoneNumber
  });
  const user = new User({
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    email: reqBody.email,
    phoneNumber: reqBody.phoneNumber,
    password: reqBody.password,
    franchise: reqBody.franchise,
    stripeId: cust.id
  });
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(reqBody.password, salt, function (err, hash) {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then(() => {
          res.status(200).json({
            success: true,
            data: {
              email: user.email,
              phoneNumber: user.phoneNumber,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err.message,
          });
        });
    });
  });
};

exports.update = async (req, res) => {
  console.log("Update user API was hit");
  const body = req.body;
  if (!body)
    return res.status(400).json({ error: "Please fill required data" });
  if (!body._id) return res.status(400).json({ error: "Missing User ID" });
  await User.findById(body._id)
    .then(async (user) => {
      if (user == null)
        return res.status(404).json({ error: "User Not Found" });
      var errors = [];
      var update = new Map();
      if (body.email) {
        if (!validation.email(body.email)) errors.push("Invalid Email");
        else {
          await User.findOne({ email: body.email }).then((result) => {
            if (!result._id.equals(user._id))
              errors.push("Email Already in Use");
          });
        }
        if (errors.length == 0) update.set("email", body.email);
      }
      if (body.phoneNumber) {
        if (!validation.phoneNumber(body.phoneNumber))
          errors.push("Invalid Phone Number");
        else {
          await User.findOne({ phoneNumber: body.phoneNumber }).then(
            (result) => {
              if (!result._id.equals(user._id))
                errors.push("Phone Number Already in Use");
            }
          );
        }
        if (errors.length == 0) update.set("phoneNumber", body.phoneNumber);
      }
      if (body.firstName) {
        if (!validation.name(body.firstName)) errors.push("Invalid First Name");
        if (errors.length == 0) update.set("firstName", body.firstName);
      }
      if (body.lastName) {
        if (!validation.name(body.lastName)) errors.push("Invalid Last Name");
        if (errors.length == 0) update.set("lastName", body.lastName);
      }
      if (body.address && !isEmptyAddress(body.address)) {
        //update address if present
        const bodyAddr = body.address;
        var addr = user.address;
        if (bodyAddr.streetAddress && bodyAddr.streetAddress !== "") {
          if (!validation.streetAddress(bodyAddr.streetAddress))
            errors.push("Invalid Street Address");
          if (errors.length == 0) addr.streetAddress = bodyAddr.streetAddress;
        }
        if (bodyAddr.city && bodyAddr.city !== "") {
          if (!validation.city(bodyAddr.city)) errors.push("Invalid City");
          if (errors.length == 0) addr.city = bodyAddr.city;
        }
        if (bodyAddr.state && bodyAddr.state !== "") {
          if (!validation.state(bodyAddr.state)) errors.push("Invalid State");
          if (errors.length == 0) addr.state = bodyAddr.state;
        }
        if (bodyAddr.postalCode && bodyAddr.postalCode !== "") {
          if (!validation.postalCode(bodyAddr.postalCode))
            errors.push("Invalid Postal Code");
          if (errors.length == 0) addr.postalCode = bodyAddr.postalCode;
        }
        if (errors.length == 0) update.set("address", addr);
      }
      if (body.dateOfBirth) {
        if (!validation.dateOfBirth(body.dateOfBirth))
          errors.push("Invalid Date of Birth");
        if (errors.length == 0) update.set("dateOfBirth", body.dateOfBirth);
      }
      if (body.gender) {
        if (!validation.gender(body.gender)) errors.push("Invalid Gender");
        if (errors.length == 0) update.set("gender", body.gender);
      }
      if (body.interests) {
        if (!validation.interests(body.interests))
          errors.push("Invalid Interests");
        if (errors.length == 0) update.set("interests", body.interests);
      }
      if (body.userType) {
        if (!validation.userType(body.userType))
          errors.push("Invalid userType");
        if (errors.length == 0) update.set("userType", body.userType);
      }
      if (body.company) {
        await Company.findById(body.company).catch(() => {
          errors.push("Invalid Company");
        });
        if (errors.length == 0) update.set("company", body.company);
      }
      if (body.franchise) {
        await Franchise.findById(body.franchise).catch(() => {
          errors.push("Invalid Franchise");
        });
        if (errors.length == 0) update.set("franchise", body.franchise);
      }
      //does not update payment details if empty or only 4 digit card
      var pd = body.paymentDetails;
      if (
        pd &&
        !isEmptyPD(pd) &&
        !(
          pd.cardNumber &&
          validation.isNumeric(pd.cardNumber) &&
          pd.cardNumber.length == 4
        )
      ) {
        if (!validation.paymentDetails(pd))
          errors.push("Invalid Payment Details");
        const cards = await stripe.customers.listSources(user.stripeId);
        for(let card of cards.data) {
          await stripe.customers.deleteSource(user.stripeId, card.id);
        }
        await stripe.customers.createSource(user.stripeId, {source: 'tok_mastercard'}); //uses test card as cannot use actual cards
        if (errors.length == 0) {
          try {
            const last4 = pd.cardNumber.slice(12, 16);
            bcrypt.genSalt(10, async function (err, salt) {
              bcrypt.hash(
                pd.cardNumber.slice(0, 12),
                salt,
                async function (err, hash) {
                  if (err)
                    return res.status(500).json({
                      error: "Error occured while encrypting card number",
                      msg: err.message,
                    });
                  else {
                    pd.cardNumber = hash + last4;
                    await user
                      .updateOne({ paymentDetails: pd })
                      .catch((err) => {
                        return res.status(500).json({
                          error:
                            "Error occurred while updating payment details",
                          msg: err.message,
                        });
                      });
                  }
                }
              );
            });
            pd.cardNumber = last4;
            update.set("paymentDetails", pd);
          } catch (err) {
            return res.status(500).json({
              error: "Error occurred while updating password",
              msg: err.message,
            });
          }
        }
      }
      if (errors.length > 0) return res.status(400).json({ errors: errors });
      for (let [key, value] of update) {
        if (key === "paymentDetails") continue;
        await user.updateOne({ [key]: value }).catch((err) => {
          return res
            .status(500)
            .json({ error: "Database Update Error", msg: err });
        });
        if(key === 'address') {
          await stripe.customers.update(user.stripeId, {
            address: {
              city: value.city,
              line1: value.streetAddress,
              postal_code: value.postalCode,
              state: value.state,
              country: 'United States'
            }
          });
        }
        else if(key === 'email') {
          await stripe.customers.update(user.stripeId, {email: value});
        }
        else if(key === 'phoneNumber') {
          await stripe.customers.update(user.stripeId, {phone: value});
        }
      }
      return res
        .status(200)
        .json({ success: true, data: Object.fromEntries(update) });
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ error: "User Not Found", msg: err.message });
    });
};

function isEmptyPD(pd) {
  return (
    pd.cardType === "" &&
    pd.nameOnCard === "" &&
    pd.cardNumber === "" &&
    pd.expiryDate === ""
  );
}

function isEmptyAddress(addr) {
  return (
    addr.streetAddress === "" &&
    addr.city === "" &&
    addr.state === "" &&
    addr.postalCode === ""
  );
}

exports.resetPassword = (req, res) => {
  console.log("Password Reset API was hit");
  crypto.randomBytes(32, (err, buffer) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Unable to generate random bytes!" });
    const token = buffer.toString("hex");
    try {
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res.status(400).json({
            error: "Email id is not registered!",
          });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 30 * 60000;
        try {
          user.save().then(async () => {
            const sendEmail = await emailSender.resetPassword(
              req.body.email,
              user.firstName,
              "http://18.191.90.138:3000/api/reset-password/" + token
            );
            return res
              .status(200)
              .json({ success: true, msg: "Email sent successfully..." });
          });
        } catch (err) {
          return res.status(500).json({
            error: "An error occurred while resetting password!",
          });
        }
      });
    } catch (err) {
      return res.status(500).json({
        error: "Some error occurred while resetting password",
        msg: err.message,
      });
    }
  });
};

exports.newPassword = (req, res) => {
  console.log("New Password API was Hit");
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "Email id is not registered!",
        });
      }
      bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(newPassword, salt, async function (err, hash) {
          if (err) {
            return res.status(500).json({
              error: "Some error occurred while updating",
              msg: err.message,
            });
          } else {
            user.password = hash;
            user.token = undefined;
            user.expireToken = undefined;
            user.save().then((saveduser) => {
              return res.status(200).json({
                success: true,
                msg: "Password updated successfully...",
              });
            });
          }
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Some error occurred while updating password",
        msg: err.message,
      });
    });
};

exports.firebaseAuthSignup = async (req, res, next) => {
  console.log("Firebase auth signup API was called...");
  const body = req.body;
  if(!body.franchise) return res.status(400).json({error: 'Franchise Required for Signup'});
  if(!body.authType)  return res.status(400).json({error: 'Auth Type Not Specified'});
  if(body.authType !== 'google.com' && body.authType !== 'facebook.com')  return res.status(400).json({error: 'Invalid Auth Type'})
  if(!body.displayName) return res.status(400).json({error: 'Missing Display Name'});
  const names = body.displayName.split(" ");
  if(!validation.name(names[0]) || !validation.name(names[1])) return res.status(400).json({error: "Invalid Display Name"});
  const altuser = await User.findOne({email: body.email});
  if(altuser != null && altuser._id)  return res.status(400).json({error: 'User With Email Already Exists'});
  const cust = await stripe.customers.create({email: body.email});
  const user = new User({
    firstName: names[0],
    lastName: names[1],
    email: body.email,
    franchise: body.franchise,
    authType: body.authType,
    stripeId: cust.id
  });
  await user.save().catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  const token = jwt.sign(
    { id: user.id, email: user.email },
    "gameplanner_secretkey",
    { expiresIn: "1h" }
  );
  return res.status(200).json({
    success: true,
    data: {
      email: user.email,
      userType: user.userType,
      token: token,
    },
  });
};

exports.firebaseAuthSignin = async (req, res, next) => {
  console.log("Firebase auth signin API was called...");
  const body = req.body;
  if(!body.authType)  return res.status(400).json({error: 'Auth Type Not Specified'});
  if(body.authType === 'phone') {
    if(!body.phoneNumber) return res.status(400).json({error: 'Missing Phone Number'});
    const phone = body.phoneNumber.substring(2);
    const user = await User.findOne({phoneNumber: phone});
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "gameplanner_secretkey",
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      success: true,
      data: {
        email: user.email,
        userType: user.userType,
        token: token,
      },
    });
  }
  if(body.authType !== 'google.com' && body.authType !== 'facebook.com')  return res.status(400).json({error: 'Invalid Auth Type'})
  const user = await User.findOne({email: body.email});
  if(user == null || !user._id) return res.status(404).json({error: "User Not Found"});
  if(user.authType === 'email')  return res.status(400).json({error: 'User Does Not Use This Auth Type'});
  const token = jwt.sign(
    { id: user.id, email: user.email },
    "gameplanner_secretkey",
    { expiresIn: "1h" }
  );
  return res.status(200).json({
    success: true,
    data: {
      email: user.email,
      userType: user.userType,
      token: token,
    },
  });
};