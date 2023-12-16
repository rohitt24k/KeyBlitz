const userDataModel = require("../models/userDataModel");
const jwt = require("jsonwebtoken");

exports.handleUserDataInput = async (req, res) => {
  console.log("hy");

  try {
    const token = req.body.token?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const pushData = req.body.data;
    const findUser = await userDataModel.findOne({ email: decoded.email });

    if (findUser) {
      findUser.data.push(pushData);
      await findUser.save();
      console.log("User data updated:", decoded.email);
    } else {
      const newData = new userDataModel({
        email: decoded.email,
        data: [pushData],
      });
      await newData.save();
      console.log("New user created:", decoded.email);
    }

    res.status(200).json({
      status: "success",
      message: "User data updated/created successfully",
    });
  } catch (error) {
    console.error("Error adding userData:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error adding userData",
    });
  }
};
