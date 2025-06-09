const express = require("express");
const adminController = require("../controllers/adminController");
const {authenticateToken,authorizeAdmin} = require('../middleware/auth');
let router = express.Router();

let adminRoute = (app) => {
  //user
  router.get("/get-all-user",authenticateToken,authorizeAdmin,adminController.getAllUser);
  router.post("/create-user", authenticateToken, authorizeAdmin, adminController.createUser);
  router.put("/update-user/:id", authenticateToken, authorizeAdmin, adminController.updateUser);
  router.delete("/delete-user/:id", authenticateToken, authorizeAdmin, adminController.deleteUser);
  //rice-variety
  router.post('/create-rice',authenticateToken,authorizeAdmin, adminController.createRice);
  router.get('/get-all-rice',authenticateToken, adminController.getAllRice);
  router.get('/get-rice/:id',authenticateToken,adminController.getRiceById);
  router.put('/update-rice/:id',authenticateToken,authorizeAdmin, adminController.updateRice);
  router.delete('/delete-rice/:id',authenticateToken,authorizeAdmin, adminController.deleteRice);
  //pest-disease
  router.post('/create-pest-disease',authenticateToken,authorizeAdmin, adminController.createPestDisease);
  router.get('/get-all-pest-disease',authenticateToken, adminController.getAllPestDisease);
  router.get('/get-pest-disease/:id',authenticateToken,adminController.getPestDiseaseById);
  router.put('/update-pest-disease/:id',authenticateToken,authorizeAdmin, adminController.updatePestDisease);
  router.delete('/delete-pest-disease/:id',authenticateToken,authorizeAdmin, adminController.deletePestDisease);
  //cutivation
  router.post('/create-cultivation',authenticateToken,authorizeAdmin, adminController.createCultivation);
  router.get('/get-all-cultivation',authenticateToken, adminController.getAllCultivation);
  router.get('/get-cultivation/:id',authenticateToken, adminController.getCultivationById);
  router.put('/update-cultivation/:id', authenticateToken,authorizeAdmin, adminController.updateCultivation);
  router.delete('/delete-cultivation/:id', authenticateToken,authorizeAdmin,adminController.deleteCultivation);
  
  //farmingmodel
  router.post('/create-farming-model',authenticateToken,authorizeAdmin,  adminController.createFarmingModel);
  router.get('/get-all-farming-model',authenticateToken, adminController.getAllFarmingModel);
  router.get('/get-farming-model/:id',authenticateToken,  adminController.getFarmingModelById);
  router.put('/update-farming-model/:id',authenticateToken,authorizeAdmin, adminController.updateFarmingModel);
  router.delete('/delete-farming-model/:id',authenticateToken,authorizeAdmin,  adminController.deleteFarmingModel);

  //topPestDiseasePrediction
  router.get('/top-pest-predictions', adminController.getTopPestPredictions);
  return app.use("/admin", router);
};

module.exports = adminRoute;
