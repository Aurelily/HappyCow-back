// Dependencies
//import packages
const express = require("express");
const formidable = require("express-formidable");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const geolib = require("geolib");

//activate package
const app = express();
app.use(formidable());
app.use(morgan("dev"));
app.use(cors());

//Mongoose
const mongoose = require("mongoose");

//routes import and activation
const userRoutes = require("./routes/user");
app.use(userRoutes);
const restaurantsRoutes = require("./routes/restaurants");
app.use(restaurantsRoutes);

//Welcome route for the app !
app.get("/", (req, res) => {
  res.status(200).json("welcome to HappyCow API !");
});

//urls to connect to database
// const url = "mongodb://Localhost/happycow"
const url = process.env.MONGODB_URI;

//connect database
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.all("*", function (req, res) {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
