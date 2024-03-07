const mongoose = require("mongoose");

let roomSchema = new mongoose.Schema(
  {
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Franchise'
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    activities: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'Activity'
    }
},
    {
      timestamps: true,
      collection: "Rooms",
    }
  );
  
  module.exports = mongoose.model("Room", roomSchema);
  