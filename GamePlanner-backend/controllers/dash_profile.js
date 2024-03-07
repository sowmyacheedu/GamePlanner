const User = require("../models/User");
const Company = require("../models/Company");
const Notification = require("../models/Notification");
const Franchise = require("../models/Franchise");
const Sale = require("../models/Sale");
const Expense = require("../models/Expense");
const Booking = require("../models/Booking");
const Activity = require("../models/Activity");
const Room = require("../models/Room");
const validation = require("./validation");
const stripe = require("stripe")(
  "sk_test_51Mui3bHcIO95vaZ7w1NMF2DE7uAcUSfPwydNMQ2bMyQWznKLJgexS3XrBU5Csy8QOMAkN1B280jsYZ2ribaarsNS00BMpW7x00"
);
const axios = require("axios");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthsabv = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

exports.getUserDetails = async (req, res) => {
  console.log("Get User Details API was Hit");
  const email = req.params.email;
  var user = await User.findOne({email: email}).catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  if(user == null || !user._id) return res.status(404).json({error: "User Not Found"});
  const mem = await updateMembershipFunc(user._id);
  if(mem) return res.status(mem.errstat).json({error: mem.error});
  user = await User.findById(user._id).catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  let paymentDetails_ = {};
  if (user.paymentDetails.cardType) {
    paymentDetails_ = {
      cardType: user.paymentDetails.cardType,
      nameOnCard: user.paymentDetails.nameOnCard,
      cardNumber: user.paymentDetails.cardNumber
        ? user.paymentDetails.cardNumber.slice(-4)
        : null,
      expiryDate: user.paymentDetails.expiryDate,
    };
  }
  var bookings = null;
  if(user.userType === 'Customer') bookings = await getBookings(user._id, null);
  else if(user.userType === 'Staff')  bookings = await getBookings(null, user.franchise);
  var cname = null;
  const fran = await Franchise.findById(user.franchise).catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  if(user.company) {
    const comp = await Company.findById(user.company).catch((err) => {
      return res.status(500).json({error: 'Internal Error', msg: err.message});
    });
    cname = comp.name;
  }
  else {
    const comp = await Company.findById(fran.company).catch((err) => {
      return res.status(500).json({error: 'Internal Error', msg: err.message});
    });
    cname = comp.name
  }
  if(user.userType === 'Management') {
    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        authType: user.authType,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        interests: user.interests,
        rewardPoints: user.rewardPoints,
        paymentDetails: paymentDetails_,
        company: cname,
        notification: await getNotification(user.franchise)
      },
    });
  }
  else {
    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        authType: user.authType,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        interests: user.interests,
        membershipStatus: user.membershipStatus,
        membershipDate: user.membershipDate,
        membershipCost: fran.price,
        rewardPoints: user.rewardPoints,
        paymentDetails: paymentDetails_,
        company: cname,
        franchise: fran.name,
        notification: await getNotification(user.franchise),
        pastBookings: bookings.past,
        currBookings: bookings.curr
      },
    });
  }
};

exports.getManagementDetails = async (req, res) => {
  console.log("Get Management Details Hit");
  const body = req.body;
  const comp = await getCompany(body);
  if(comp.error)  return res.status(comp.errstat).json({error: comp.error});
  //determine if proper number of filters
  var numFilter = 0;
  if (body.franchise) numFilter++;
  if (body.state) numFilter++;
  if (body.city) numFilter++;
  if (numFilter > 1) return res.status(400).json({ error: "Too Many Filters" });

  //get franchises based on filters (and check that filter is proper)
  var franchises = null;
  if (body.franchise) {
    if (!validation.isAlphabeticPlusPunct(body.franchise))
      return res.status(400).json({ error: "Invalid Franchise Name" });
    franchises = await Franchise.find({
      company: comp._id,
      name: body.franchise,
    }).catch((err) => {
      return res.status(500).json({ error: err.message });
    });
  } else {
    if (body.state) {
      if (!validation.isAlphabetic(body.state))
        return res.status(400).json({ error: "Invalid State" });
    } else if (body.city) {
      if (!validation.isAlphabeticPlusPunct(body.city))
        return res.status(400).json({ error: "Invalid City" });
    }
    franchises = await Franchise.find({ company: comp._id }).catch(
      (err) => {
        return res.status(500).json({ error: err.message });
      }
    );
    if (body.state) {
      var p = 0;
      while (p < franchises.length) {
        if (franchises[p].address.state !== body.state) franchises.splice(p, 1);
        else p++;
      }
    } else if (body.city) {
      var p = 0;
      while (p < franchises.length) {
        if (franchises[p].address.city !== body.city) franchises.splice(p, 1);
        else p++;
      }
    }
  }

  //collect sales and expenses of relevant franchises
  var sales = [];
  var expenses = [];
  for (var i = 0; i < franchises.length; i++) {
    const newSales = await Sale.find({ franchise: franchises[i] }).catch(
      (err) => {
        return res.status(500).json({ error: err.message });
      }
    );
    for (var j = 0; j < newSales.length; j++) sales.push(newSales[j]);
    const newExps = await Expense.find({ franchise: franchises[i] }).catch(
      (err) => {
        return res.status(500).json({ error: err.message });
      }
    );
    for (var j = 0; j < newExps.length; j++) expenses.push(newExps[j]);
  }

  //current date
  const date = validation.getDateInfo(validation.getCurrDateAndTime().date);
  var cm = date.month - 11;
  var yr = date.year;
  if (cm < 1) {
    cm += 12;
    yr--;
  }

  //relevant dates for YTD
  var monthData = [];

  while (cm != date.month) {
    monthData.push({
      year: yr,
      month: cm,
      sales: 0,
      expenses: 0,
    });
    cm++;
    if (cm == 13) {
      cm = 1;
      yr++;
    }
  }
  monthData.push({
    year: yr,
    month: cm,
    sales: 0,
    expenses: 0,
  });

  //add sales to appropriate month totals
  for (var i = 0; i < sales.length; i++) {
    const sdate = parseDate(sales[i].date);
    var j = -1;
    if (monthData[0].year == sdate.year) {
      if (sdate.month >= monthData[0].month)
        j = sdate.month - monthData[0].month;
    } else if (monthData[11].year == sdate.year) {
      if (monthData[11].month >= sdate.month)
        j = 11 - (monthData[11].month - sdate.month);
    }
    if (j == -1) continue;
    monthData[j].sales += sales[i].amount;
  }

  //add expenses to appropriate month totals
  for (var i = 0; i < expenses.length; i++) {
    const edate = parseDate(expenses[i].date);
    var j = -1;
    if (monthData[0].year == edate.year) {
      if (edate.month >= monthData[0].month)
        j = edate.month - monthData[0].month;
    } else if (monthData[11].year == edate.year) {
      if (monthData[11].month >= edate.month)
        j = 11 - (monthData[11].month - edate.month);
    }
    if (j == -1) continue;
    monthData[j].expenses += expenses[i].amount;
  }

  //turnover (sum profits/losses and divide by 12)
  var sales = 0;
  var exps = 0;

  //calculate profit/loss or even for each month and add to turnover
  for (var i = 0; i < 12; i++) {
    if (monthData[i].expenses > monthData[i].sales) {
      monthData[i] = {
        year: monthData[i].year,
        month: monthsabv[monthData[i].month - 1],
        sales: round(monthData[i].sales, 2),
        expenses: round(monthData[i].expenses, 2),
        loss: round(monthData[i].expenses - monthData[i].sales, 2),
      };
    } else {
      monthData[i] = {
        year: monthData[i].year,
        month: monthsabv[monthData[i].month - 1],
        sales: round(monthData[i].sales, 2),
        expenses: round(monthData[i].expenses, 2),
        profit: round(monthData[i].sales - monthData[i].expenses, 2),
      };
    }
    sales += monthData[i].sales;
    exps += monthData[i].expenses;
  }

  const lep = sales - exps;
  
  //return results
  //loss
  if(lep < 0) {
    return res.status(200).json({
      success: true,
      data: {
        sales: round(sales, 2),
        expenses: round(exps, 2),
        loss: round(-1 * lep, 2),
        turnover: round(lep / 12, 2),
        company: comp.name,
        monthlyData: monthData,
      }
    });
  }
  //profit
  return res.status(200).json({
    success: true,
    data: {
      company: comp.name,
      sales: round(sales, 2),
      expenses: round(exps, 2),
      profit: round(lep, 2),
      turnover: round(lep / 12, 2),
      monthlyData: monthData,
    }
  });
};

exports.companyDrop = async (req, res) => {
  console.log('companyDrop hit');
  const comp = await getCompany(req.body);
  if(comp.error)  return res.status(comp.errstat).json({error: comp.error});
  return res.status(200).json({
    success: true,
    data: {
      company: [comp.name]
    }
  });
}

exports.franchiseDrop = async (req, res) => {
  console.log('franchiseDrop hit');
  const comp = await getCompany(req.body);
  if(comp.error)  return res.status(comp.errstat).json({error: comp.error});
  await Franchise.find({ company: comp._id }).then((result) => {
    var frnames = [];
    for(var i = 0; i < result.length; i++) frnames.push(result[i].name);
    return res.status(200).json({
      success: true,
      data: {
        franchises: frnames.sort()
      }});
  }).catch(
    (err) => {
      return res.status(404).json({ error: err.message });
  });
}

exports.stateDrop = async (req, res) => {
  console.log('stateDrop hit');
  const comp = await getCompany(req.body);
  if(comp.error)  return res.status(comp.errstat).json({error: comp.error});
  await Franchise.find({ company: comp._id }).then((result) => {
    var states = [];
    for(var i = 0; i < result.length; i++) {
      if(!validation.contains(states, result[i].address.state))  states.push(result[i].address.state);
    }
    return res.status(200).json({
      success: true,
      data: {
        states: states.sort()
      }});
  }).catch(
    (err) => {
      return res.status(404).json({ error: err.message });
  });
}

exports.cityDrop = async (req, res) => {
  console.log('cityDrop hit');
  const comp = await getCompany(req.body);
  if(comp.error)  return res.status(comp.errstat).json({error: comp.error});
  await Franchise.find({ company: comp._id }).then((result) => {
    var cities = [];
    for(var i = 0; i < result.length; i++) {
      if(!validation.contains(cities, result[i].address.city))  cities.push(result[i].address.city);
    }
    return res.status(200).json({
      success: true,
      data: {
        cities: cities.sort()
      }});
  }).catch(
    (err) => {
      return res.status(404).json({ error: err.message });
  });
}

exports.updateMembership =  async (req, res) => {
  console.log('Update Membership Hit');
  const email = req.body.email;
  if(!email)  return res.status(400).json({error: "Email Required"});
  const user = await User.findOne({email: email}).catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  if(user == null || !user._id) return res.status(404).json({error: "User Not Found"});
  const fran = await Franchise.findById(user.franchise).catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  })
  if(fran == null || !fran._id) return res.status(404).json({error: "User's Franchise Does Not Exist"});
  await user.updateOne({membershipDate: yearFromCurr(), membershipStatus: 'Active'}).catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  const curr = validation.getCurrDateAndTime();
  const sale = new Sale({
    franchise: user.franchise,
    type: "Membership",
    user: user._id,
    date: curr.date,
    time: curr.time,
    amount: fran.price
  });
  await sale.save().catch((err) => {
    return res.status(500).json({error: 'Internal Error', msg: err.message});
  });
  return res.status(200).json({success: true});
}

function yearFromCurr() {
  var di = parseDate(validation.getCurrDateAndTime().date);
  di.year++;
  return di.month.toString() + "/" + di.day.toString() +"/" + di.year.toString();
}

function parseDate(date) {
  const spl = date.split("/");
  return {
    month: parseInt(spl[0]),
    day: parseInt(spl[1]),
    year: parseInt(spl[2])
  };
}

async function getNotification(fid) {
  console.log(fid);
  if(!fid)  return [];
  const franchise = await Franchise.findById(fid).catch((err) => {
    return res
      .status(404)
      .json({ error: "User's franchise does not exist in the DB!" });
  });
  const company = await Company.findById(franchise.company).catch((err) => {
    return res.status(404).json({ error: "No such company exists in the DB!" });
  });
  const content = await Notification.find({ company: company._id }).catch(
    () => {
      return res.status(404).json({
        error: "No Notification content available for specified company!",
      });
    }
  );
  return content
    .map((con) => {
      if (validation.futureDateAndTime(con.date, con.time)) return con.content;
    })
    .filter((obj) => obj);
}

async function getCompany(body) {
  if (!body || (!body.email && !body.phoneNumber))
    return {error: "Missing Necessary Field(s)", errstat: 400};
  var useEmail = body.email;
  var user = null; //the result from findOne for the user
  if (useEmail) {
    //attempts to find user based on email
    if (!validation.email(body.email))
      return {error: "Invalid Email Address", errstat: 400};
    user = await User.findOne({ email: body.email }).catch((err) => {
      return {error: err.message, errstat: 500};
    });
  } else {
    //attempts to find user based on phone number
    if (!validation.phoneNumber(body.phoneNumber))
      return { error: "Invalid Phone Number", errstat: 400};
    user = await User.findOne({ phoneNumber: body.phoneNumber }).catch(
      (err) => {
        return { error: err.message, errstat: 500};
      }
    );
  }
  //proper user verification and find company associated with user
  if (user == null) return { error: "User Not Found", errstat: 404};
  if (user.userType !== "Management")
    return {error: "User is not management", errstat: 400};
  if (!user.company)  return {error: "Manager does not have a company they work for", errstat: 400};
  const comp = await Company.findById(user.company).catch((err) => {
    return { error: err.message, errstat: 500};
  });
  if (!comp)  return { error: "Manager's company does not exist", errstat: 404};
  return comp;
}

function round(num, decimalPlaces) {
  const mult = Math.pow(10, decimalPlaces);
  return Math.round(num * mult) / mult;
}

//0 for past, 1 for current
async function getBookings(uid, fid) {
  var past = [];
  var curr = [];
  if(uid != null) {
    const bookings = await Booking.find({user: uid});
    for(let book of bookings) {
      const aname = ((Activity) (await Activity.findById(book.activity))).name;
      const room = ((Room) (await Room.findById(book.room))).name;
      for(let t of book.startTimes) {
        const time = t.toString() + ":00";
        const data = {
          activity: aname,
          date: book.date,
          startTime: time,
          room: room,
        };
        if(validation.futureDateAndTime(book.date, time))  curr.push(data);
        else  past.push(data);
      }
    }
  }
  else {
    const bookings = await Booking.find({franchise: fid});
    for(let book of bookings) {
      const aname = ((Activity) (await Activity.findById(book.activity))).name;
      const room = ((Room) (await Room.findById(book.room))).name;
      const cname = ((User) (await User.findById(book.user))).firstName;
      for(let t of book.startTimes) {
        const time = t.toString() + ":00";
        const data = {
          activity: aname,
          customer: cname,
          date: book.date,
          startTime: time,
          room: room,
        };
        if(validation.futureDateAndTime(book.date, time))  curr.push(data);
        else  past.push(data);
      }
    }
  }
  past = past.sort((a, b) => {
    const dc = validation.compareDate(b.date, a.date);
    if(dc != 0) return dc;
    const tc = validation.compareTime(b.startTime, a.startTime);
    if(tc != 0) return tc;
    if(a.customer) {
      const cc = a.customer.localeCompare(b.customer);
      if(cc != 0) return cc;
    }
    const ac = a.activity.localeCompare(b.activity);
    if(ac != 0) return ac;
    return a.room.localeCompare(b.room);
  });
  curr = curr.sort((a, b) => {
    const dc = validation.compareDate(a.date, b.date);
    if(dc != 0) return dc;
    const tc = validation.compareTime(a.startTime, b.startTime);
    if(tc != 0) return tc;
    if(a.customer) {
      const cc = a.customer.localeCompare(b.customer);
      if(cc != 0) return cc;
    }
    const ac = a.activity.localeCompare(b.activity);
    if(ac != 0) return ac;
    return a.room.localeCompare(b.room);
  });
  return {
    past: past,
    curr: curr
  };
}

async function updateMembershipFunc(uid) {
  const user = await User.findById(uid).catch((err) => {
    return {errstat: 500, error: err.message};
  });
  if(user == null || !user._id) return {errstat: 404, error: 'User Not Found'};
  const act = user.membershipDate && validation.futureDate(user.membershipDate);
  if(act) {
    if(user.membershipStatus !== 'Active') {
      await user.updateOne({membershipStatus: 'Active'}).catch((err) => {
        return {errstat: 500, error: err.message};
      });
    }
  }
  else {
    if(user.membershipStatus !== 'Inactive') {
      await user.updateOne({membershipStatus: 'Inactive'}).catch((err) => {
        return {errstat: 500, error: err.message};
      });
    }
  }
}

exports.membershipCheckout = async (req, res, next) => {
  console.log("Membership Checkout API called");
  const body = req.body;
  try {
    var user = await User.findOne({ email: body.email }).catch(
      (err) => {
        return res
          .status(500)
          .json({ error: "Internal Error", msg: err.messgae });
      }
    );
    if (user == null || !user.email)
      return res.status(404).json({ error: "User Not Found" });
      const mem = await updateMembershipFunc(user._id);
      if(mem) return res.status(mem.errstat).json({error: mem.error});
      user = await User.findById(user._id).catch((err) => {
        return res.status(500).json({error: 'Internal Error', msg: err.message});
      });
      if(user.membershipStatus === 'Active')  return res.status(400).json({error: "Already a Member"});
      const fran = await Franchise.findById(user.franchise).catch((err) => {
        return res.status(500).json({error: 'Internal Error', msg: err.message});
      });
      if(fran == null || !fran._id) return res.status(400).json({error: "Franchise Associated with User Does not Exist"});
      //may need code if reject people that are already members
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
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: fran.price * 100,
            product_data: {
              name: "Yearly Membership to " + fran.name,
              description: "Ends " + yearFromCurr()
            },
          },
          //tax_rates: [service_id, tax_id],
        }
      ],
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        type: "Membership",
        customer_email: body.email
      },
      success_url: "http://18.191.90.138:3000/BookingSuccess",
      cancel_url: "http://18.191.90.138:3000/BookingFailure",
    });
    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    next();
    // res.status(500).json({error: "Checkout failed"});
  }
};