const authModel = require("../models/authenticationModel");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      status: "error",
      message: "User credentials are missing",
    });
  } else {
    try {
      const userData = await authModel.findOne({ email });
      if (userData) {
        res.status(409).json({
          status: "error",
          messsage: "the user already exists",
        });
      } else {
        const bcrypt = require("bcrypt");
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new authModel({
          name,
          email,
          password: hashedPassword,
        });

        const user = await newUser.save();
        user.password = undefined;
        console.log(user);

        const token = jwt.sign(
          { name: user.name, email: user.email, id: user._id },
          process.env.JWT_SECRET_KEY
        );
        // res.cookie("token", `Bearer ${token}`, {
        //   expires: new Date(Date.now() + 84500 * 1000 * 7),
        // });
        return res.status(200).json(token);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error during signup",
      });
    }
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "User credentials are missing",
    });
  } else {
    try {
      const userData = await authModel.findOne({ email });
      if (userData) {
        const bcrypt = require("bcrypt");
        bcrypt.compare(password, userData.password, function (err, result) {
          if (err) {
            res.status(404).json({
              status: "error",
              message: "Internal server error during password comparison",
            });
          } else {
            if (result) {
              userData.password = undefined;
              const token = jwt.sign(
                {
                  name: userData.name,
                  email: userData.email,
                  id: userData._id,
                },
                process.env.JWT_SECRET_KEY
              );
              // res.cookie("token", `Bearer ${token}`, {
              //   expires: new Date(Date.now() + 84500 * 1000 * 7),
              // });

              res.status(200).json(token);
            } else {
              res
                .status(401)
                .json({ status: "error", message: "Password incorrect" });
            }
          }
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "the user is not registered",
        });
      }
    } catch (error) {
      console.error("Error during signin:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error during signin",
      });
    }
  }
};
