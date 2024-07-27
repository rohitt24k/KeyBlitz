const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connect = require("./db/connect");
const loginRoute = require("./router/loginRoute");
const userDataRoute = require("./router/userDataRoute");
const convRoute = require("./router/convRoute");
const geminiRoute = require("./router/geminiRoute");
let cookies = require("cookie-parser");
const sockets = require("./sockets/index");

const server = new http.createServer(app);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://192.168.25.201:3000",
      "https://keyblitz.vercel.app",
      "https://keyblitz.pages.dev",
    ],
    // origin: "https://keyblitz.vercel.app",
    credentials: true,
  })
);
app.use(cookies());

//connecting to the mongodb server
connect(process.env.MONGODB_URI);

const io = sockets.initializeSocket(server);

app.use("/api", userDataRoute);
app.use("/api", loginRoute);
app.use("/api", convRoute);
app.use("/api", geminiRoute);

server.listen(process.env.PORT, () => {
  console.log("the server is running at port 3001");
});
