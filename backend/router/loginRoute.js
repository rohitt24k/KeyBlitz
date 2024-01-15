const express = require("express");
const { signup, signin, status } = require("../controllers/loginControllers");

const router = express.Router();

router.post("/signin", signin);

router.post("/signup", signup);
router.get("/status", status);

module.exports = router;
