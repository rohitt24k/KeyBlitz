const express = require("express");
const {
  searchUser,
  createConversation,
  loadConversations,
  getConversation,
  addMessage,
} = require("../controllers/convControllers");

const router = express.Router();

router.post("/searchuser", searchUser);
router.post("/createConversation", createConversation);
router.post("/loadConversations", loadConversations);
router.get("/getConversation/:id", getConversation);
router.post("/addMessage", addMessage);

module.exports = router;
