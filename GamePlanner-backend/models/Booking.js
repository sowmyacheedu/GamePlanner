const mongoose = require("mongoose");
const modelLists = require('./modelLists');

let bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Franchise'
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Activity'
    },
    equipmentCount: {
      type: Number,
      required: true,
      default: 0
    },
    date: {
      type: String,
      required: true
    },
    startTimes: {
      type: [Number],
      required: true
    }
  },
  {
    timestamps: true,
    collection: "Bookings",
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
