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
    const reqName = req.query.name;

    //Fonction de tri ordre alphabetique par nom
    function tri(a, b) {
      return a.name > b.name ? 1 : -1;
    }

    //Je crée un tableau vide qui contiendra les nouveaux résultats filtrés selon la query
    let newResult = [];

    //si il y a un type en query je modifie les datas envoyées
    if (reqType || reqName) {
      //Je récupère dans un tableau ma query contenant plusieurs types séparés par des virgules
      const typesTab = reqType.split(",");

      //Je récupère le test regex de ma recherche
      let reqSearch = new RegExp(reqName, "i");

      //Je push les restaus qui correspondent uniquement aux query récupérés dans typesTab
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < typesTab.length; j++) {
          if (
            data[i].type.indexOf(typesTab[j]) !== -1 &&
            reqSearch.test(data[i].name) === true
          ) {
            newResult.push(data[i]);
          }
        }
      }
      newResult.sort(tri);
      res.status(200).json(newResult);
    } else {
      data.sort(tri);
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//GET : restaurants around user
app.get("/restaurants/around", async (req, res) => {
  //Définir les query possibles
  const reqLongitude = req.query.longitude;
  const reqLatitude = req.query.latitude;
  //Je crée un tableau vide qui contiendra seulement les coordonnées des lieux
  // let placesAround = [];

  if (reqLongitude && reqLatitude) {
    try {
      const placesAround = geolib.orderByDistance(
        { latitude: reqLatitude, longitude: reqLongitude },
        [
          { latitude: 48.862881, longitude: 2.351543 },
          { latitude: 48.861446, longitude: 2.358393 },
          { latitude: 48.849205, longitude: 2.349775 },
        ]
      );
      res.status(200).json(placesAround);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "Missing location" });
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
