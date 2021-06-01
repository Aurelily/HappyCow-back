// Dependencies
//import packages
const express = require("express");
const formidable = require("express-formidable");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

//activate package
const app = express();
app.use(formidable());
app.use(morgan("dev"));
app.use(cors());

//Mongoose
const mongoose = require("mongoose");

//import restaurants json datas
const data = require("./datas/restaurants.json");

//routes import and activation
const userRoutes = require("./routes/user");
app.use(userRoutes);

//Welcome route for the app !
app.get("/", (req, res) => {
  res.status(200).json("welcome to HappyCow API !");
});

//GET : all restaurants or Query type
app.get("/restaurants", async (req, res) => {
  try {
    //Définir les différentes sortes de requetes/recherches possibles
    const reqType = req.query.types;

    //Je crée un tableau vide qui contiendra nouveaux résultats filtrés selon la query
    let newResult = [];

    //si il y a un type en query je modifie les datas envoyées
    if (reqType) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].type.indexOf(reqType) !== -1) {
          newResult.push(data[i]);
        }
      }
      res.status(200).json(newResult);
    } else {
      res.status(200).json(data);
    }

    // res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
