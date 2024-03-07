const Activity = require("../models/Activity");
const Booking = require("../models/Booking");
const Franchise = require("../models/Franchise");
const Company = require("../models/Company");
const User = require("../models/User");
const Room = require("../models/Room");
const Sale = require("../models/Sale");
const validation = require("./validation");
const sendEmail = require("../config/sendEmail");
const stripe = require("stripe")(
  "sk_test_51Mui3bHcIO95vaZ7w1NMF2DE7uAcUSfPwydNMQ2bMyQWznKLJgexS3XrBU5Csy8QOMAkN1B280jsYZ2ribaarsNS00BMpW7x00"
);
const axios = require("axios");
const tax_id = "txr_1MnaCAB1sRKdcQ9KcEPh9r6l";
const service_id = "txr_1MnaBaB1sRKdcQ9KJ6jkjHH4";

exports.getActivities = async (req, res) => {
  const body = req.body;
  if (!body.email)
    return res.status(400).json({ error: "User Email Required" });
  if (!validation.email(body.email))
    return res.status(400).json({ error: "Invalid Email" });
  const user = await User.findOne({ email: body.email }).catch((err) => {
    return res.status(500).json({ error: "Internal Error", msg: err.messgae });
  });
  if (user == null || !user.email)
    return res.status(404).json({ error: "User Not Found" });
  const fran = await Franchise.findById(user.franchise).catch((err) => {
    return res.status(500).json({ error: "Internal Error", msg: err.message });
  });
  if (fran == null || !fran.name)
    return res.status(404).json({ error: "Franchise Not Found" });
  var acts = [];
  if (body.category) {
    if (!validation.category(body.category))
      return res.status(400).json({ error: "Invalid Category" });
    acts = await Activity.find({
      franchise: fran._id,
      activityType: body.category,
    }).catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal Error", msg: err.message });
    });
  } else {
    acts = await Activity.find({ franchise: fran._id }).catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal Error", msg: err.message });
    });
  }
  acts.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  var info = [];
  for (let act of acts) {
    info.push({
      name: act.name,
      defaultRoom: act.defaultRoom,
      imglink: act.imglink,
    });
  }
  return res.status(200).json({
    success: true,
    data: info,
  });
};

exports.getSlots = async (req, res) => {
  const body = req.body;
  if (!body.room) return res.status(400).json({ error: "Missing Room Name" });
  if (!validation.roomName(body.room))
    return res.status(400).json({ error: "Invalid Room Name" });
  if (!body.date) return res.status(400).json({ error: "Missing Date" });
  if (!validation.date(body.date))
    return res.status(400).json({ error: "Invalid Date" });
  if (!validation.currOrFutureDate(body.date))
    return res.status(400).json({ error: "Date is in the Past" });
  const room = await Room.findOne({ name: body.room }).catch((err) => {
    return res.status(500).json({ error: "Internal Error", msg: err.message });
  });
  if (room == null || !room.name)
    return res.status(404).json({ error: "Room Not Found" });
  var avail = [];
  const currDT = validation.getCurrDateAndTime();
  const dcomp = validation.compareDate(body.date, currDT.date);
  const tint = parseInt(currDT.time.split(":")[0]);
  for (var t = validation.openHour; t <= validation.closeHour; t++) {
    if(dcomp == 0 && t < tint) {
      avail.push({
        time: t,
        available: false
      });
      continue;
    }
    const b = await Booking.findOne({
      room: room._id,
      date: body.date,
      startTimes: t,
    }).catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal Error", msg: err.message });
    });
    avail.push({
      time: t,
      available: !(b != null && b.user),
    });
  }
  return res.status(200).json({
    success: true,
    data: avail,
  });
};

exports.createBooking = async (req, res) => {
  const body = req.body;
  const info = await bookValidation(body);
  if (info.error) return res.status(info.errstat).json({ error: info.error });
  const book = new Booking({
    user: info.user,
    franchise: info.franchise,
    room: info.room,
    activity: info.activity,
    equipmentCount: body.equipmentCount,
    date: body.date,
    startTimes: body.startTimes,
  });
  await book.save().catch((err) => {
    return res.status(500).json({ error: "Internal Error", msg: err.message });
  });
  const act = await Activity.findById(info.activity);

  const sale = new Sale({
    franchise: info.franchise,
    type: "Booking",
    user: info.user,
    booking: book._id,
    date: body.date,
    time: body.startTimes[0].toString() + ":00",
    amount:
      act.price * body.startTimes.length +
      act.equipment.price * (body.equipmentCount || 0),
  });
  await sale.save().catch((err) => {
    return res.status(500).json({ error: "Internal Error", msg: err.message });
  });
  const se = await sendEmail.bookingInfo(info.email, info.firstName, book._id);
  if (se && se.error)
    return res
      .status(500)
      .json({ error: "Could Not Send User Email", msg: se.error });
  return res.status(200).json({
    success: true,
    data: {
      bid: book._id,
    },
  });
};

async function bookValidation(bookInfo) {
  if (!bookInfo.email) return { errstat: 400, error: "User Email Required" };
  if (!validation.email(bookInfo.email))
    return { errstat: 400, error: "Invalid Email" };
  const user = await User.findOne({ email: bookInfo.email }).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  if (user == null || !user.email)
    return { errstat: 404, error: "User Not Found" };
  const fran = await Franchise.findById(user.franchise).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  if (fran == null || !fran.name)
    return { errstat: 404, error: "Franchise Not Found" };
  if (!bookInfo.room) return { errstat: 400, error: "Room Name Missing" };
  if (!validation.roomName(bookInfo.room))
    return { errstat: 400, error: "Invalid Room Name" };
  const room = await Room.findOne({ name: bookInfo.room }).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  if (room == null || !room.name)
    return { errstat: 404, error: "Room Not Found" };
  if (!bookInfo.activity) return { errstat: 400, error: "Activity Missing" };
  if (!validation.activity(bookInfo.activity))
    return { errstat: 400, error: "Invalid Activity" };
  const act = await Activity.findOne({
    franchise: fran._id,
    name: bookInfo.activity,
  }).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  if (act == null || !act.name)
    return { errstat: 404, error: "Activity Not Found" };
  var found = false;
  for (let actid of room.activities) {
    if (actid.equals(act._id)) {
      found = true;
      break;
    }
  }
  if (!found)
    return { errstat: 400, error: "Room Not Associated with Activity" };
  if (bookInfo.equipmentCount) {
    if (!(await validation.equipmentCount(bookInfo.equipmentCount, act._id)))
      return { errstat: 400, error: "Invalid Amount of Equipment" };
  }
  if (!bookInfo.date) return { errstat: 400, error: "Missing Date" };
  if (!validation.date(bookInfo.date))
    return { errstat: 400, error: "Invalid Date" };
  if (!bookInfo.startTimes)
    return { errstat: 400, error: "Missing Start Times" };
  if (!validation.startTimes(bookInfo.startTimes))
    return { errstat: 400, error: "Invalid Start Times" };
  if (!validation.futureDate(bookInfo.date)) {
    if (
      validation.compareDate(
        bookInfo.date,
        validation.getCurrDateAndTime().date
      ) == 0
    ) {
      for (let t of bookInfo.startTimes) {
        if (!validation.futureTime(t.toString() + ":00"))
          return { errstat: 400, error: "Start Time is in the Past" };
      }
    } else return { errstat: 400, error: "Date is in the Past" };
  }
  for (let t of bookInfo.startTimes) {
    const altBook = await Booking.findOne({
      room: room._id,
      date: bookInfo.date,
      startTimes: t,
    }).catch((err) => {
      return { errstat: 500, error: err.message };
    });
    if (altBook != null && altBook._id)
      return { errstat: 400, error: "Room is Reserved At a Start Time" };
  }
  return {
    user: user._id,
    franchise: fran._id,
    room: room._id,
    activity: act._id,
    email: user.email,
    firstName: user.firstName,
  };
}

exports.getRooms = async (req, res) => {
  console.log("Get Rooms API was Hit");
  let errors = [];
  const activityName = req.params.activity;
  if (!validation.activity(activityName)) {
    errors.push("Invalid Format for Activity");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  Activity.findOne({ name: activityName })
    .then(async (activity) => {
      if (!activity) {
        return res.status(404).json({
          error: "Activity not found!",
        });
      } else {
        let rooms = [];
        if (activity.rooms) {
          rooms = activity.rooms;
        }
        return res.status(200).json({
          success: true,
          data: {
            activity: activityName,
            rooms: rooms,
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.getEquipment = async (req, res) => {
  console.log("Get Equipment API was Hit");
  let errors = [];
  const activityName = req.params.activity;
  if (!validation.activity(activityName)) {
    errors.push("Invalid Format for Activity");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  Activity.findOne({ name: activityName })
    .then(async (activity) => {
      if (!activity) {
        return res.status(404).json({
          error: "Activity not found!",
        });
      } else {
        let equipment = {};
        if (activity.equipment) {
          equipment = activity.equipment;
        }
        return res.status(200).json({
          success: true,
          data: {
            activity: activityName,
            equipment: equipment,
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.getPrice = async (req, res) => {
  console.log("Get Price API was Hit");
  let reqBody = req.body;
  let errors = [];
  let activityName = reqBody.activity;
  let numSlots = reqBody.numSlots;
  let numEquipment = reqBody.numEquipment || 0;
  if (!activityName) {
    errors.push("Activity is Required");
  } else if (!validation.activity(activityName)) {
    errors.push("Invalid Format for Activity");
  }
  if (!numSlots) {
    errors.push("Number of slots required");
  } else if (!validation.numSlots(numSlots)) {
    errors.push("Invalid Number of Slots");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  Activity.findOne({ name: activityName })
    .then(async (activity) => {
      if (!activity) {
        return res.status(404).json({
          error: "Actvity not found!",
        });
      } else {
        let price = 1;
        if (!(await validation.equipmentCount(numEquipment, activity._id))) {
          errors.push("Invalid Equipment Count!");
        }
        if (errors.length > 0) {
          return res.status(400).json({ errors: errors });
        }
        if (activity.price) {
          price = activity.price;
        }
        const pricePerSlot = price;
        const priceForBookedSlots = price * numSlots;
        const pricePerEquipment = activity.equipment.price || 0;
        const priceForBookedEquipment = pricePerEquipment * numEquipment;
        const totalPrice = priceForBookedSlots + priceForBookedEquipment;
        return res.status(200).json({
          success: true,
          data: {
            activity: activityName,
            pricePerSlot: pricePerSlot,
            priceForBookedSlots: priceForBookedSlots,
            pricePerEquipment: pricePerEquipment,
            priceForBookedEquipment: priceForBookedEquipment,
            totalPrice: totalPrice,
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.getBookingInfoExt = async (req, res) => {
  if (!req.params.bid)
    return res.status(400).json({ error: "Need To Provide Booking ID" });
  const binfo = await this.getBookingInfoFunc(req.params.bid);
  if (binfo.error)
    return res.status(binfo.errstat).json({ error: binfo.error });
  return res.status(200).json({
    success: true,
    data: binfo,
  });
};

exports.getBookingInfoFunc = async (bid) => {
  const book = await Booking.findById(bid).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  if (book == null || !book._id)
    return { errstat: 404, error: "Booking Not Found" };
  const fran = await Franchise.findById(book.franchise).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  const comp = await Company.findById(fran.company).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  const room = await Room.findById(book.room).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  const act = await Activity.findById(book.activity).catch((err) => {
    return { errstat: 500, error: err.message };
  });
  const addr =
    fran.address.streetAddress +
    ", " +
    fran.address.city +
    ", " +
    fran.address.state +
    " " +
    fran.address.postalCode;
  var time = "";
  const ts = book.startTimes;
  for (var i = 0; i < ts.length; i++) {
    time += ampm(ts[i]) + " - " + ampm(ts[i] + 1);
    if (i != ts.length - 1) time += ", ";
  }
  var eq = "None";
  if (book.equipmentCount > 0) {
    eq = book.equipmentCount.toString() + " " + act.equipment.name;
    if (book.equipmentCount > 1) eq += "s";
  }
  return {
    comp: comp.name,
    fran: fran.name,
    addr: addr,
    date: book.date,
    time: time,
    activity: act.name,
    room: room.name,
    equipment: eq,
  };
};

function ampm(hour) {
  var ampm = "A";
  if (hour >= 12) ampm = "P";
  if (hour == 0) hour = 12;
  if (hour > 12) hour -= 12;
  return hour.toString() + ":00 " + ampm + "M";
}

exports.checkout = async (req, res, next) => {
  console.log("Checkout API called");
  const body = req.body;
  const info = await bookValidation(body.booking);
  if (info.error) return res.status(info.errstat).json({ error: info.error });
  try {
    const user = await User.findOne({ email: body.booking.email }).catch(
      (err) => {
        return res
          .status(500)
          .json({ error: "Internal Error", msg: err.messgae });
      }
    );
    if (user == null || !user.email)
      return res.status(404).json({ error: "User Not Found" });
    const equipmentCount = body.booking.equipmentCount || 0;
    if(equipmentCount == 0) {
      const session = await stripe.checkout.sessions.create({
        client_reference_id: user._id,
        customer: user.stripeId,
        customer_update: {
          address: "auto",
          name: "auto",
          shipping: "auto",
        },
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            quantity: body.booking.startTimes.length,
            price_data: {
              currency: "usd",
              unit_amount: body.price.pricePerSlot * 100,
              product_data: {
                name: body.booking.room,
              },
            },
            //tax_rates: [service_id, tax_id],
          },
        ],
        phone_number_collection: {
          enabled: true,
        },
        metadata: {
          type: "Booking",
          customer_email: body.booking.email,
          room_name: body.booking.room,
          activity_name: body.booking.activity,
          date: body.booking.date,
          start_times: body.booking.startTimes.toString(),
          equipment_count: equipmentCount.toString(),
        },
        success_url: "http://18.191.90.138:3000/BookingSuccess",
        cancel_url: "http://18.191.90.138:3000/BookingFailure",
      });
      res.json({ url: session.url });
    }
    else {
      const session = await stripe.checkout.sessions.create({
        client_reference_id: user._id,
        customer: user.stripeId,
        customer_update: {
          address: "auto",
          name: "auto",
          shipping: "auto",
        },
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            quantity: body.booking.startTimes.length,
            price_data: {
              currency: "usd",
              unit_amount: body.price.pricePerSlot * 100,
              product_data: {
                name: body.booking.room,
              },
            },
            //tax_rates: [service_id, tax_id],
          },
          {
            quantity: equipmentCount,
            price_data: {
              currency: "usd",
              unit_amount: body.price.pricePerEquipment * 100,
              product_data: {
                name: body.booking.equipmentName,
              },
            },
            //tax_rates: [service_id, tax_id],
          },
        ],
        phone_number_collection: {
          enabled: true,
        },
        metadata: {
          type: "Booking",
          customer_email: body.booking.email,
          room_name: body.booking.room,
          activity_name: body.booking.activity,
          date: body.booking.date,
          start_times: body.booking.startTimes.toString(),
          equipment_count: equipmentCount.toString(),
        },
        success_url: "http://18.191.90.138:3000/BookingSuccess",
        cancel_url: "http://18.191.90.138:3000/BookingFailure",
      });
      res.json({ url: session.url });
    }
    
  } catch (error) {
    console.log(error);
    next();
    // res.status(500).json({error: "Checkout failed"});
  }
};

exports.success = async (req, res, next) => {
  return res.json({ data: "Booking Successfull" });
};

exports.failure = async (req, res, next) => {
  return res.json({ data: "Booking Failed" });
};

exports.pay = async (request, response, next) => {
  console.log("Pay API was Hit..");
  try {
    const payloadString = JSON.stringify(request.body, null, 2);
    const secret =
      "whsec_59582e7c8b01502a4a7240c59a16a7296701a61f1b1674865bebd555ff42e050";

    const header = await stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    const event = stripe.webhooks.constructEvent(payloadString, header, secret);
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;

        const paymentIntent = await stripe.paymentIntents.retrieve(
          checkoutSessionCompleted.payment_intent
        );

        const metadata = checkoutSessionCompleted.metadata;

        const charge_id = paymentIntent.latest_charge;

        const charge = await stripe.charges.retrieve(charge_id);

        if(metadata.type === 'Booking') {
            var startTimes = [];
          const spl = metadata.start_times.split(",");
          for (let t of spl) {
            startTimes.push(parseInt(t));
          }

          await axios
            .post("http://18.223.24.199:3000/api/createBooking", {
              //.post("http://localhost:3000/api/createBooking", {
              email: metadata.customer_email,
              room: metadata.room_name,
              activity: metadata.activity_name,
              date: metadata.date,
              startTimes: startTimes,
              equipmentCount: parseInt(metadata.equipment_count),
            })
            .then(function (response) {
              //console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        else if(metadata.type === 'Membership') {
          await axios
          .post("http://18.223.24.199:3000/api/membershipUpdate", {
            //.post("http://localhost:3000/api/membershipUpdate", {
              email: metadata.customer_email
          })
          .then(function (response) {
            //console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        }
        else {
          response.status(400).json({error: "Unknown Checkout Session Type"});
        }

        

        break;

      case "charge.succeeded":
        break;
      case "payment_intent.succeeded":
        break;
      case "payment_intent.created":
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    response.status(200).json({ success: "Payment successful." });
  } catch (error) {
    console.log(error);
    next();
    // response.status(400).json({ "Webhook Error": err });
  }
};

exports.getFranchiseUsers = async (req, res) => {
  console.log("Get Franchise Users API was Hit");
  const email = req.params.email;
  if(!validation.email(email))  return res.status(400).json({error: "Invalid Email"});
  const staff = await User.findOne({email: email}).catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  if(staff == null || !staff._id) return res.status(404).json({error: "User Not Found"});
  if(staff.userType !== 'Staff')  return res.status(400).json({error: 'User is Not Staff'});
  const users = await User.find({franchise: staff.franchise, userType: "Customer"});
  var emails = [];
  for(let user of users)  emails.push(user.email);
  return res.status(200).json({
    success: true,
    data: emails.sort()
  });
};