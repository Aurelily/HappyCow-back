// Dependencies

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

require("dotenv").config();

const mongoose = require("mongoose");

var morgan = require("morgan");
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

//import restaurants json datas
const data = require("./datas/restaurants.json");

//routes import and activation
const userRoutes = require("./routes/user");
app.use(userRoutes);

//Welcome route for the app !
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to HappyCow API by Lily !" });
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
