//for validation of fields from models

const modelLists = require('../models/modelLists');

const Activity = require('../models/Activity');

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const phoneNumberRegexexp =
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const timeOffset = -4; //for EDT
const minage = 12; //minimum age for user
exports.openHour = 6; //first hour franchise is open
exports.closeHour = 23; //last hour franchise is open

//validates specific information

exports.contains = (list, item) => {
    if(typeof list !== 'object')    return false;
    if(list.length == 0)    return false;
    if(typeof list[0] != typeof item)   return false;
    var res = false;
    for(var i = 0; i < list.length; i++) {
        if(list[i] === item) {
            res = true;
            break;
        }
    }
    return res;
}

exports.isAlphabetic = (str) => {
    if(typeof str !== 'string') return false;
    if(str.length < 0) return false;
    var res = true;
    for(var i = 0; i < str.length; i++) {
        const letter = str.charAt(i);
        if(!((letter >= 'a' && letter <= 'z') || (letter >= 'A' && letter <= 'Z'))) {
            res = false;
            break;
        }
    }
    return res;
}

exports.isAlphabeticPlusPunct = (str) => {
    if(typeof str !== 'string') return false;
    if(str.length < 0) return false;
    var res = true;
    for(var i = 0; i < str.length; i++) {
        const letter = str.charAt(i);
        if(letter == ' ' || letter == '.' || letter == ',' || letter == '-')    continue;
        if(!((letter >= 'a' && letter <= 'z') || (letter >= 'A' && letter <= 'Z'))) {
            res = false;
            break;
        }
    }
    return res;
}

exports.isNumeric = (str) => {
    if(typeof str !== 'string') return false;
    if(str.length <= 0) return false;
    var res = true;
    for(var i = 0; i < str.length; i++) {
        const letter = str.charAt(i);
        if(letter < '0' || letter > '9') {
            res = false;
            break;
        }
    }
    return res;
}

//function: local-part@domain
exports.email = (email) => {
    return typeof email === 'string' && emailRegexp.test(email);
};

exports.name = (name) => {
    return typeof name === 'string' && this.isAlphabetic(name);
}

exports.password = (password) => {
    return typeof password === 'string';
}

//format: #########
exports.phoneNumber = (pn) => {
    return typeof pn === 'string' && phoneNumberRegexexp.test(pn);
}

exports.userType = (ut) => {
    //makes sure user type is a type specified in userTypes
    return typeof ut === 'string' && this.this.contains(modelLists.userTypes, ut);
}

exports.address = (addr) => {
    //makes sure address has the proper fields of the proper type
    if(!addr.streetAddress || !addr.city || !addr.state || !addr.postalCode)    return false;
    return this.streetAddress(addr.streetAddress) && this.city(addr.city) && this.state(addr.state) && this.postalCode(addr.postalCode);
}

exports.streetAddress = (str) => {
    return typeof str === 'string';
}

exports.city = (city) => {
    return typeof city === 'string' && this.isAlphabeticPlusPunct(city);
}

exports.state = (state) => {
    return typeof state === 'string' && this.isAlphabetic(state);
}

exports.postalCode = (postalCode) => {
    if(typeof postalCode !== 'string')    return false;
    if(postalCode.length == 5)    return this.isNumeric(postalCode);
    else if(postalCode.length == 10)   return postalCode.charAt(5) == '-' && this.isNumeric(postalCode.substring(0, 5)) && this.isNumeric(postalCode.substring(6));
    return false;
}

//format: MM/DD/YYYY
exports.date = (date) => {
    if(typeof date !== 'string')   return false;
    const datespl = date.split('/');
    if(datespl.length != 3) return false;
    var nums = true;
    for(var i = 0; i < 3; i++) {
        if(!this.isNumeric(datespl[i])) {
            nums = false;
            break;
        }
    }
    if(!nums)   return false;
    const info = this.getDateInfo(date);
    if(info.month == 0 || info.month > 12)  return false; //eliminates invalid months
    if(info.day <= 0 || info.day > 31)    return false; //eliminates a day greater than 31
    else if(info.yr <= 1800) return false;
    else if(info.day == 31 && (info.month == 4 || info.month == 6 || info.month == 9 || info.month == 11))	return false; //eliminates 31st on 30 day months
    else if(info.month == 2 && info.day > 29)	return false; //eliminates 30th in February (max 29 days)
    else if(info.month == 2 && info.day == 29) { //if 29th in February
        //invalid if not a leap year (condition is !(leapyear))
        //leap year determined by mod 4; if start of a century (mod 100) then it needs to be mod 400 to be a leap year
        if(!(info.year % 4 == 0 && (info.year % 100 != 0 || info.year % 400 == 0)))	return false;
    }
    return true;
}

exports.getDateInfo = (date) => {
    const spl = date.split('/');
    return {
        month: parseInt(spl[0]),
        day: parseInt(spl[1]),
        year: parseInt(spl[2])
    };
}

exports.compareDate = (a, b) => {
    const ainfo = this.getDateInfo(a);
    const binfo = this.getDateInfo(b);
    const ydiff = ainfo.year - binfo.year;
    if(ydiff != 0)  return ydiff;
    const mdiff = ainfo.month - binfo.month;
    if(mdiff != 0)  return mdiff;
    return ainfo.day - binfo.day;
}

exports.currOrFutureDate = (date) => {
    return this.compareDate(date, this.getCurrDateAndTime().date) >= 0;
}

exports.futureDate = (date) => {
    return this.compareDate(date, this.getCurrDateAndTime().date) > 0;
}

//format: ##:## (24 Hour Format)
exports.time = (time) => {
    if(typeof time !== 'string')    return false;
    const spl = time.split(':');
    if(spl.length != 2) return false;
    if(spl[1].length != 2)    return false;
    if(!this.isNumeric(spl[0]) || !this.isNumeric(spl[1]))    return false;
    const h = parseInt(spl[0]);
    const m = parseInt(spl[1]);
    return h >= 0 && h < 24 && m >= 0 && m < 60;
}

exports.getTimeInfo = (time) => {
    const spl = time.split(':');
    return {
        hour: parseInt(spl[0]),
        minute: parseInt(spl[1])
    };
}

exports.compareTime = (a, b) => {
    const ainfo = this.getTimeInfo(a);
    const binfo = this.getTimeInfo(b);
    const hdiff = ainfo.hour - binfo.hour;
    if(hdiff != 0)  return hdiff;
    return ainfo.minute - binfo.minute;
}

exports.futureTime = (time) => {
    return this.compareTime(time, this.getCurrDateAndTime().time) > 0;
}

exports.futureDateAndTime = (date, time) => {
    const curr = this.getCurrDateAndTime();
    const dcomp = this.compareDate(date, curr.date);
    if(dcomp < 0)   return false;
    else if(dcomp > 0)  return true;
    return this.compareTime(time, curr.time) > 0;
}

exports.getCurrDateAndTime = () => {
    const date = new Date((new Date()).getTime() + (3600000 * timeOffset));
    const dateTime = date.toISOString().split('T');
    return {
        date: dateTime[0].substring(5, 7) + "/" + dateTime[0].substring(8, 10) + "/" + dateTime[0].substring(0, 4),
        time: dateTime[1].substring(0, 5)
    };
}

exports.dateOfBirth = (dob) => {
    if(!this.date(dob)) return false;
    const info = this.getDateInfo(dob);
    //make sure the person is at least minage (currently 12) years old
    const currDate = this.getDateInfo(this.getCurrDateAndTime().date);
    const age = currDate.year - info.year;
    if(age > minage)    return true;
    else if(age < minage)   return false;
    if(info.month < currDate.month)   return true;
    else if(info.month > currDate.month)  return false;
    return info.day <= currDate.day;
}

exports.gender = (gender) => {
    //makes sure gender is a type specified in gender
    return typeof gender === 'string' && this.contains(modelLists.genders, gender);
}

exports.interests = (interests) => {
    return typeof interests === 'string';
}

exports.membershipStatus = (ms) => {
    //makes sure membership status (ms) is a type specified in activeTypes
    return typeof ms === 'string' && this.contains(modelLists.activeTypes, ms);
}

exports.paymentDetails = (pd) => {
    if(!pd.cardType || !pd.nameOnCard || !pd.cardNumber || !pd.expiryDate)  return false;
    if(typeof pd.cardType !== 'string' || typeof pd.nameOnCard !== 'string' || typeof pd.cardNumber !== 'string' || typeof pd.expiryDate !== 'string')  return false;
    //make sure proper card type and name is a name
    if(!this.contains(modelLists.cardTypes, pd.cardType) || pd.cardNumber.length != 16 || !this.isAlphabeticPlusPunct(pd.nameOnCard))  return false;
    //check card number this.contains numbers
    if(!this.isNumeric(pd.cardNumber))   return false;
    //make sure expiration date is a date and is after the current month
    if(pd.expiryDate.length != 5)   return false;
    if(pd.expiryDate.charAt(2) != '/')  return false;
    var expMonth;
    var expYr;
    try {
        expMonth = parseInt(pd.expiryDate.substring(0, 2));
        if(expMonth == 0 || expMonth > 12)  return false;
        expYr= parseInt(pd.expiryDate.substring(3));
    }
    catch(err) {
        return false;
    }
    const date = new Date();
    const datestr = date.toISOString();
    const yr = parseInt(datestr.substring(2, 4));
    if(yr > expYr)  return false;
    else if(yr != expYr)    return true;
    const month = parseInt(datestr.substring(5, 7));
    return month <= expMonth;
}

exports.payment = (payment) => {
    if(!payment.amount || !payment.hasPaid) return false;
    if(typeof payment.amount !== 'number' || typeof payment.hasPaid != 'string')    return false;
    return this.contains(modelLists.bool, payment.hasPaid);
}

exports.content = (content) => {
    return typeof content == 'string';
}

exports.location = (loc) => {
    return loc.lat && loc.lng && typeof loc.lat === 'number' && typeof loc.lng === 'number';
}

exports.category = (category) => {
    return typeof category === 'string' && this.contains(modelLists.categories, category);
}

exports.activity = (act) => {
    return typeof act === 'string' && this.isAlphabeticPlusPunct(act);
}

exports.roomName = (name) => {
    return typeof name === 'string';
}

exports.equipmentCount = async (count, aid) => {
    if(typeof count !== 'number' || !Number.isInteger(count) || count < 0)  return false;
    const act = await Activity.findById(aid).catch((err) => {
        return err.message;
    });
    return count <= (act.equipment.limit || 0);
}

exports.startTimes = (startTimes) => {
    if(typeof startTimes !== 'object')    return false;
    if(startTimes.length == 0)  return false;
    for(var i = 0; i < startTimes.length; i++) {
        if(!this.startTime(startTimes[i]))  return false;
        for(var j = i - 1; j >= 0; j--) {
            if(startTimes[i] === startTimes[j]) return false;
        }
    }
    return true;
}

exports.startTime = (startTime) => {
    return typeof startTime === 'number' && Number.isInteger(startTime) && startTime >= this.openHour && startTime <= this.closeHour;
}

exports.numSlots = (slots) => {
    return typeof slots === 'number' && Number.isInteger(slots) && slots > 0 && slots <= this.closeHour - this.openHour + 1;
}