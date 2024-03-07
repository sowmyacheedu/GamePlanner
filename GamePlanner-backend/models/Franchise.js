const mongoose = require("mongoose");

let franchiseSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Company'
    },
    name: {
      type: String,
      required: true
    },
    address: {
      streetAddress: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
    },
    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    price: { //relative price
      type: Number,
      required: true,
      default: 60
    }
  },
  {
    timestamps: true,
    collection: "Franchises",
  }
);

module.exports = mongoose.model("Franchise", franchiseSchema);
