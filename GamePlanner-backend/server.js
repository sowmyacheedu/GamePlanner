//dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

//dotenv
require("dotenv").config();

//App
app.use(cors());
app.use(express.json());

//DB_Connect
const uri = "mongodb+srv://lmadaan:Lakshay123@cluster0.4x09ztp.mongodb.net";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo DB Connection was Successful"))
  .catch((err) => console.log("Some Error occured: " + err));

//routes
const authRoutes = require("./routes/auth");
const notifyRoutes = require("./routes/notify");
const dash_profileRoutes = require("./routes/dash_profile");
const searchRoutes = require("./routes/search");
const bookingRoutes = require("./routes/booking");
const mapsRoutes = require("./routes/maps");

app.use("/api", authRoutes);
app.use("/api", notifyRoutes);
app.use("/api", dash_profileRoutes);
app.use("/api", searchRoutes);
app.use("/api", bookingRoutes);
app.use("/api", mapsRoutes);

app.get("/test", (req, res) => {
  console.log("Test was called!");
  res.send("Node setup worked");
});

app.listen(port, () => {
  console.log("Welcome to Node!!");
});
