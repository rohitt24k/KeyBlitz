const express = require("express");
const { handleUserDataInput } = require("../controllers/userDataControllers");

const router = express.Router();

router.post("/userDataIn", handleUserDataInput);

module.exports = router;
