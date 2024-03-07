const mongoose = require("mongoose");

let expenseSchema = new mongoose.Schema(
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
    collection: "Expenses",
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
