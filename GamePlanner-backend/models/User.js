const mongoose = require("mongoose");
const modelLists = require("./modelLists");

let userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true
    },
    userType: {
      type: String,
      required: true,
      enum: modelLists.userTypes,
      default: "Customer",
    },
    address: {
      streetAddress: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: modelLists.genders,
    },
    interests: {
      type: String,
    },
    membershipStatus: {
      type: String,
      enum: modelLists.activeTypes,
      default: "Inactive",
    },
    membershipDate: {
      type: String
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    paymentDetails: {
      cardType: {
        type: String,
        enum: modelLists.cardTypes,
      },
      nameOnCard: {
        type: String,
      },
      cardNumber: {
        type: String,
      },
      expiryDate: {
        type: String,
      },
    },
    company: {
      //for management
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    franchise: {
      //for customer and staff
      type: mongoose.Schema.Types.ObjectId,
      default: "6414b57ddbf14e3482bb8a39",
      ref: "Franchise",
    },
    resetToken: {
      type: String,
    },
    expireToken: {
      type: Date,
    },
    authType: {
      type: String,
      enum: modelLists.authTypes,
      default: "email",
    },
    stripeId: {
      type: String,
      //required: true
    }
  },
  {
    timestamps: true,
    collection: "User_Details",
  }
);

module.exports = mongoose.model("User", userSchema);
