require("express-async-errors");
require("dotenv").config();
const path = require("path");
const multer = require("multer");

const express = require("express");
const app = express();
const connectMongoDb = require("./config/connectMDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3100;

//connect Data Base
connectMongoDb;
app.use(cors(corsOptions));

//middleware

app.use(express.json());
app.use(express.static("images"));
app.use(cookieParser());

//route

app.use("/", require("./route/rootRoute"));
app.use("/auth", require("./route/authRoute"));
app.use("/items", require("./route/itemRoute"));
app.use("/users", require("./route/userRoute"));
app.use("/orders", require("./route/orderRoute"));
app.use("/reviews", require("./route/reviewRoute"));
app.use("/wish_lists", require("./route/wishListRoute"));
app.use("/reset", require("./route/resetRoute"));

//handling page not found
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "no json data found" });
  } else {
    res.send("sorry, not found");
  }
});

// connecting to port and Data Bse
mongoose.connection.once("open", () => {
  console.log(`app is connected to Mongo DataBase`);
  app.listen(PORT, () => {
    console.log(`app is running on ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
