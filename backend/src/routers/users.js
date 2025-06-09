const express = require("express");
const userController = require("../controllers/userController.js");
var {authenticateToken} = require('../middleware/auth');
let router = express.Router();

let userRoute = (app) => {
  router.post("/register", userController.register);
  router.post("/login", userController.login);
  router.get("/current-user", authenticateToken, userController.getCurrentUser);
  router.post("/logout", userController.logout);
  router.get("/get-rice-types",userController.getRiceTypes)
  router.get("/get-pest-diseases-category",userController.getPestDiseasesCategory)
  router.get("/get-pest-diseases-stages",userController.getPestDiseasesStages)
  router.post("/pest-prediction",userController.pestPrediction);
  return app.use("/users", router);
};

module.exports = userRoute;
