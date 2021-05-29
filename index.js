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

//import et activation des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);

//Route d'accueil pour MongoDB ATLAS
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to HappyCow API by Lily !" });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

app.all("*", function (req, res) {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT || 3200, () => {
  console.log("Server started");
});
