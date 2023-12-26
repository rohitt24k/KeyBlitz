const convModel = require("../models/convModel");
const authModel = require("../models/authenticationModel");
const jwt = require("jsonwebtoken");

const searchUser = async (req, res) => {
  let { data } = req.body;
  if (!data) {
    res
      .status(400)
      .send({ status: "error", message: "email/name of the user is missing" });
    return;
  }
  data = data.toLowerCase();
  try {
    const user = await authModel.findOne({ email: data });
    if (!user) {
      const users = await authModel.find({ name: data }, { _id: 1, name: 1 });
      if (!users) {
        res.status(404).send("user is not there");
      }
      res.status(200).send(users);
      return;
    }
    res.status(200).send([user]);
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error searching user",
    });
  }
};

const createConversation = async (req, res) => {
  const { receiverDetails } = req.body;
  // console.log("receiverDetails", receiverDetails);

  const token = req.body.token?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const pushData = [
      receiverDetails,
      { userId: decoded.id, name: decoded.name },
    ];
    const conv = new convModel({ users: pushData });
    const response = await conv.save();
    res.status(200).json({
      status: "success",
      message: "Conversation created successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "there was an error creating conversation",
    });
    console.log(error);
  }
};

const loadConversations = async (req, res) => {
  const token = req.body.token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const response = await convModel.find(
      { "users.userId": decoded.id },
      { users: 1 }
    );
    res.status(200).json({
      status: "success",
      message: "conversations successfully loaded",
      data: response,
    });
  } catch (error) {
    console.log("error in loadConversations", error);
    res.status(500).json({
      status: "error",
      message: "The was an error loading convesations",
    });
  }
};

const getConversation = async (req, res) => {
  const conversationId = req.params.id;
  try {
    const response = await convModel.findById(conversationId, { messages: 1 });
    res.status(200).json({
      status: "success",
      message: "converstaion successfully fetched",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "there was an error fetching conversation",
    });
  }
};

const addMessage = async (req, res) => {
  const { conversationId, data } = req.body;

  try {
    const response = await convModel.updateOne(
      { _id: conversationId },
      { $push: { messages: data } }
    );
    res.status(200).json({
      status: "success",
      message: "message added to db",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "There was an error adding message to db",
    });
    console.log(error);
  }
};

const startMatch = async (req, res) => {
  const token = req.body.token?.split(" ")[1];
  const { conversationId } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const pushData = { senderId: decoded.id, match: { status: "request" } };
    const response = await convModel.findByIdAndUpdate(
      { _id: conversationId },
      { $push: { messages: pushData } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Request successfully sent",
      data: response,
    });
  } catch (error) {
    console.log("error in startMatch: ", error);
    res
      .status(500)
      .json({ status: "error", message: "there was an error starting match" });
  }
};

module.exports = {
  searchUser,
  createConversation,
  loadConversations,
  getConversation,
  addMessage,
  startMatch,
};
