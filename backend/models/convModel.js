const mongoose = require("mongoose");

const convSchema = new mongoose.Schema(
  {
    users: [
      {
        userId: { type: String, required: true },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    messages: [
      {
        senderId: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        match: {
          winner: String,
          speed: [Number],
          status: String,
          expiryTime: Date,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const convModel = mongoose.model("conv", convSchema);

module.exports = convModel;
