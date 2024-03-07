const mongoose = require("mongoose");

let saleSchema = new mongoose.Schema(
  {
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Franchise'
    },
    type: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    collection: "Sales",
  }
);

module.exports = mongoose.model("Sale", saleSchema);
