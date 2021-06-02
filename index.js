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
    const reqName = req.query.name;

    //Fonction de tri ordre alphabetique par nom
    function tri(a, b) {
      return a.name > b.name ? 1 : -1;
    }

    //Je crée un tableau vide qui contiendra nouveaux résultats filtrés selon la query
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
          if (data[i].type.indexOf(typesTab[j]) !== -1) {
            newResult.push(data[i]);
          }
        }
        //Je push les restaus qui correspondent à ma recherche par name
        if (data[i].name.indexOf(reqSearch) !== -1) {
          newResult.push(data[i]);
        }
      }
      newResult.sort(tri);
      res.status(200).json(newResult);
    } else {
      data.sort(tri);
      res.status(200).json(data);
    }

    // if (reqName) {
    //   let reqSearch = new RegExp(reqName, "i");
    //   for (let k = 0; k < data.length; k++) {
    //     if (data[k].name.indexOf(reqSearch) !== -1) {
    //       newResult.push(data[k]);
    //     }
    //   }
    //   newResult.sort(tri);
    //   res.status(200).json(newResult);
    // } else {
    //   data.sort(tri);
    //   res.status(200).json(data);
    // }

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
