const express = require("express");
const { startConv } = require("../controllers/geminiControllers");

const router = express.Router();

router.get("/startChat", startConv);

module.exports = router;
