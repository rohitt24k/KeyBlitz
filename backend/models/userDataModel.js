const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  data: [],
});

const userDataModel = mongoose.model("userdata", userDataSchema);

module.exports = userDataModel;
