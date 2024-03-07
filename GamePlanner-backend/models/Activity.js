const mongoose = require("mongoose");
const modelLists = require('./modelLists');

let activitySchema = new mongoose.Schema(
  {
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Franchise'
    },
    name: {
        type: String,
        required: true
    },
    imglink: {
        type: String,
        required: true
    },
    rooms: {
        type: [String],
        required: true
    },
    defaultRoom: {
        type: String,
        required: true
    },
    activityType: {
        type: [String],
        enum: modelLists.categories
    },
    price: {
        type: Number,
        required: true
    },
    equipment: {
        name: {
            type: String
        },
        price: {
            type: Number
        },
        limit: {
            type: Number
        }
    }
  },
  {
    timestamps: true,
    collection: "Activities",
  }
);

module.exports = mongoose.model("Activity", activitySchema);
