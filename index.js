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
    const reqType1 = req.query.type1;

    // //Je crée un objet vide qui contiendra mes clés de filtre
    // let filters = {};

    // //si il y a un type j'ajoute la clé type1 à mon objet filters'
    // if (reqType1) {
    //   filters.type1 = new RegExp(reqType1, "i");
    // }
    // //Je mets mon objet filters dans ma requete find() pour obtenir mon résultat filtré
    // let restaurants = await data.find(filters);

    // // calculer le nombre de résultats
    // const count = await data.countDocuments(filters);

    // //réponse au client
    // res.status(200).json({
    //   count: count,
    //   restaurants: restaurants,
    // });
    res.status(200).json(data);
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
