const express = require("express");
const router = express.Router();
const geolib = require("geolib");

//import restaurants json datas
const data = require("../datas/restaurants.json");

//GET : all restaurants or Query type
router.get("/restaurants", async (req, res) => {
  try {
    //Définir les différentes sortes de requetes/recherches possibles
    const reqType = req.query.types;
    const reqName = req.query.name;
    const reqLongitude = req.query.longitude;
    const reqLatitude = req.query.latitude;

    // Fonction de tri ordre alphabetique par nom
    function tri(a, b) {
      return a.name > b.name ? 1 : -1;
    }

    //  Fonction de tri ordre de distance
    function triDistance(a, b) {
      return a.distanceKm > b.distanceKm ? 1 : -1;
    }

    //Fonction qui calcule la distance entre le user et un restau si la loc est autorisée
    const calcDistance = (latPlace, longPlace) => {
      let distanceKm =
        geolib.getDistance(
          { latitude: reqLatitude, longitude: reqLongitude },
          { latitude: latPlace, longitude: longPlace }
        ) / 1000;
      return distanceKm;
    };

    //Je crée un tableau vide qui contiendra les nouveaux résultats filtrés selon la query
    let newResult = [];

    //si il y a un filtre en query (soit type soit search)
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
            if (reqLatitude && reqLongitude) {
              let distanceKm = calcDistance(
                data[i].location.lat,
                data[i].location.lng
              );
              data[i].distanceKm = distanceKm;
            }
            newResult.push(data[i]);
          }
        }
      }
      if (reqLatitude && reqLongitude) {
        newResult.sort(triDistance);
      } else {
        newResult.sort(tri);
      }

      res.status(200).json(newResult);
      //   console.log(newResult);
    } else {
      //Si pas de filtres (le cas quand on arrive directement sur la home page)
      for (let i = 0; i < data.length; i++) {
        if (reqLatitude && reqLongitude) {
          let distanceKm = calcDistance(
            data[i].location.lat,
            data[i].location.lng
          );
          data[i].distanceKm = distanceKm;
        }
      }
      if (reqLatitude && reqLongitude) {
        data.sort(triDistance);
      } else {
        data.sort(tri);
      }
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// //GET : restaurants around user
// router.get("/restaurants/around", async (req, res) => {
//   //Définir les query possibles
//   const reqLongitude = req.query.longitude;
//   const reqLatitude = req.query.latitude;
//   //Je crée un tableau vide qui contiendra les résultats près de moi de la loc user si autorisé
//   const coordsTab = [];

//   if (reqLongitude && reqLatitude) {
//     try {
//       for (let i = 0; i < data.length; i++) {
//         coordsTab.push({
//           latitude: data[i].location.lat,
//           longitude: data[i].location.lng,
//           id: data[i].placeId,
//         });
//       }
//       res.status(200).json(coordsTab);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   } else {
//     res.status(400).json({ error: "Missing location" });
//   }
// });

//export router
module.exports = router;
