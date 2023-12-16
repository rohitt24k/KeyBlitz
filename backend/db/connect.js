const mongoose = require("mongoose");

const connect = async (uri) => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to the mongodb server");
};

module.exports = connect;
