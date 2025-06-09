const { response } = require("express");
const adminService = require("../services/adminService");
const { parse } = require("dotenv");

//Quan ly nguoi dung
let getAllUser = async(req,res) => {
    try{
        let data = await adminService.getAllUserService();
        return res.status(200).json(data)
    }catch(error){
        return res.status(400).json(error)
    }
}

let createUser = async (req, res) => {
    try {
        let { email, password, username,role, image } = req.body;
        let newUser = await adminService.createUserService({ email, password, username, role, image });
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let updateUser = async (req, res) => {
    try {
        let userId = req.params.id;
        let userData = req.body;
        let updatedUser = await adminService.updateUserService(userId, userData);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let deleteUser = async (req, res) => {
    try {
        let userId = req.params.id;
        await adminService.deleteUserService(userId);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(400).json(error);
    }
};

//rice-variety
let createRice = async (req, res) => {
    try {
        let riceTypeIds = [];
        if (typeof req.body.riceTypes === "string") {
            try {
                riceTypeIds = JSON.parse(req.body.riceTypes);
                if (!Array.isArray(riceTypeIds)) {
                    riceTypeIds = [];
                }
            } catch (err) {
                console.error("Lỗi parse riceTypes:", err);
                riceTypeIds = [];
            }
        } else if (Array.isArray(req.body.riceTypes)) {
            riceTypeIds = req.body.riceTypes;
        }
        const riceData = {
            ...req.body,
            riceTypeIds,
        };

        let newRice = await adminService.createRiceService(riceData, req.files);
        return res.status(200).json({
            data: newRice,
        });
    } catch (error) {
        console.error("Error in createRice:", error);
        return res.status(400).json({
            error: error.message || error,
        });
    }
};

let getAllRice = async(req, res) => {
    try{
        let riceList = await adminService.getAllRiceService();
        return res.status(200).json({riceList})
    }catch(error){
        return res.status(400).json(error);
    }
}

let getRiceById = async(req,res) => {
    try{
        let riceId = req.params.id;
        let rice = await adminService.getRiceByIdService(riceId);
        if(!rice){
            return res.status(404).json({message: "No rice variety found"})
        } 
        return res.status(200).json({rice})
    }catch(error){
        return res.status(400).json(error)
    }
}

let updateRice = async(req,res) => {
    try{
        let riceId = req.params.id;
        const updateData = req.body;
        try {
            if (typeof updateData.riceTypes === 'string') {
              updateData.riceTypes = JSON.parse(updateData.riceTypes);
            }
          } catch (e) {
            return res.status(400).json({ message: 'Invalid riceTypes format' });
          }
        let updatedRice = await adminService.updateRiceService(riceId, updateData, req.files);
        if(!updatedRice){
            return res.status(404).json({message: "No rice variety found"})
        }
        return res.status(200).json({updatedRice})
    }catch(error){
        return res.status(400).json(error)
    }
}

let deleteRice = async(req,res) => {
    try{
        let riceId = req.params.id;
        let deletedRice = await adminService.deleteRiceService(riceId);
        if(!deletedRice){
            return res.status(404).json({message: "No rice variety found"})
        }
        return res.status(200).json({message: "Rice variety deleted"})
    }catch(error){
        return res.status(400).json(error)
    }
}

//pest-disease
let createPestDisease = async (req, res) => {
    try {
        let growthStageIds = [];
        if (typeof req.body.growthStageIds === "string") {
            try {
                growthStageIds = JSON.parse(req.body.growthStageIds);
                if (!Array.isArray(growthStageIds)) {
                    growthStageIds = [];
                }
            } catch (err) {
                console.error("Lỗi parse growthStageIds:", err);
                growthStageIds = [];
            }
        } else if (Array.isArray(req.body.growthStageIds)) {
            growthStageIds = req.body.growthStageIds;
        }
        const pestDiseaseData = {
            ...req.body,
            growthStageIds,
        };
        let newPestDisease = await adminService.createPestDiseaseService(pestDiseaseData, req.files);

        return res.status(200).json({
            data: newPestDisease,
        });
    } catch (error) {
        console.error("Error in createPestDisease:", error);
        return res.status(400).json({
            error: error.message || error,
        });
    }
};

let getAllPestDisease = async(req, res) => {
    try{
        let pestDiseaseList = await adminService.getAllPestDiseaseService();
        return res.status(200).json({pestDiseaseList})
    }catch(error){
        return res.status(400).json(error);
    }
}

let getPestDiseaseById = async(req,res) => {
    try{
        let pestDiseaseId = req.params.id;
        let pestDisease = await adminService.getPestDiseaseByIdService(pestDiseaseId);
        if(!pestDisease){
            return res.status(404).json({message: "No pest disease found"})
        } 
        return res.status(200).json({pestDisease})
    }catch(error){
        return res.status(400).json(error)
    }
}   

let updatePestDisease = async(req,res) => {
    try{
        let pestDiseaseId = req.params.id;
        const updateData = req.body;
        try{
            if (typeof updateData.growthStageIds === 'string') {
              updateData.growthStageIds = JSON.parse(updateData.growthStageIds);
            }
          }
          catch (e) {
            return res.status(400).json({ message: 'Invalid growthStageIds format' });      
            }
        let updatedPestDisease = await adminService.updatePestDiseaseService(pestDiseaseId, updateData, req.files);
        if(!updatedPestDisease){
            return res.status(404).json({message: "No pest disease found"})
        }
        return res.status(200).json({updatedPestDisease})
    }catch(error){
        return res.status(400).json(error)
    }
}
let deletePestDisease = async(req,res) => {
    try{
        let pestDiseaseId = req.params.id;
        let deletedPestDisease = await adminService.deletePestDiseaseService(pestDiseaseId);
        if(deletedPestDisease.errCode !== 0){ 
            return res.status(400).json(deletedPestDisease);
        }
        return res.status(200).json(deletedPestDisease);
    }catch(error){
        return res.status(400).json(error)
    }
}   

// Cultivation Technique
let createCultivation = async (req, res) => {
    try {
        let newCultivation = await adminService.createCultivationService(req.body);
        return res.status(200).json(newCultivation);
    } catch (error) {
        console.error("Error in createCultivation:", error);
        return res.status(400).json({
            error: error.message || error,
        });
    }
};

let getAllCultivation = async (req, res) => {
    try {
        let cultivationList = await adminService.getAllCultivationService();
        return res.status(200).json(cultivationList);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let getCultivationById = async (req, res) => {
    try {
        let cultivationId = req.params.id;
        let cultivation = await adminService.getCultivationByIdService(cultivationId);
        if (!cultivation) {
            return res.status(404).json({ message: "No cultivation technique found" });
        }
        return res.status(200).json(cultivation);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let updateCultivation = async (req, res) => {
    try {
        let cultivationId = req.params.id;
        let updatedCultivation = await adminService.updateCultivationService(cultivationId, req.body);
        if (!updatedCultivation) {
            return res.status(404).json({ message: "No cultivation technique found" });
        }
        return res.status(200).json(updatedCultivation);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let deleteCultivation = async (req, res) => {
    try {
        let cultivationId = req.params.id;
        let result = await adminService.deleteCultivationService(cultivationId);
        if (result.errCode !== 0) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(error);
    }
};

// Farming Model
let createFarmingModel = async (req, res) => {
    try {
        let newFarmingModel = await adminService.createFarmingModelService(req.body, req.files);
        return res.status(200).json(newFarmingModel);
    } catch (error) {
        console.error("Error in createFarmingModel:", error);
        return res.status(400).json({
            error: error.message || error,
        });
    }
};

let getAllFarmingModel = async (req, res) => {
    try {
        let farmingModelList = await adminService.getAllFarmingModelService();
        return res.status(200).json(farmingModelList);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let getFarmingModelById = async (req, res) => {
    try {
        let farmingId = req.params.id;
        let farmingModel = await adminService.getFarmingModelByIdService(farmingId);
        if (!farmingModel) {
            return res.status(404).json({ message: "No farming model found" });
        }
        return res.status(200).json(farmingModel);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let updateFarmingModel = async (req, res) => {
    try {
        let farmingId = req.params.id;
        let updatedFarmingModel = await adminService.updateFarmingModelService(farmingId, req.body, req.files);
        if (!updatedFarmingModel) {
            return res.status(404).json({ message: "No farming model found" });
        }
        return res.status(200).json(updatedFarmingModel);
    } catch (error) {
        return res.status(400).json(error);
    }
};

let deleteFarmingModel = async (req, res) => {
    try {
        let farmingId = req.params.id;
        let result = await adminService.deleteFarmingModelService(farmingId);
        if (result.errCode !== 0) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getTopPestPredictions = async (req, res) => {
    try {
        const result = await adminService.getTopPestPredictionService();
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            data: result
        });
    } catch (error) {
        console.error('Error getting top pest predictions:', error);
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Error getting top pest predictions',
            error: error.message
        });
    }
};
module.exports = {
    getAllUser,
    createUser,
    updateUser,
    deleteUser,
    createRice,
    getAllRice,
    getRiceById,
    updateRice,
    deleteRice,
    createPestDisease,
    getAllPestDisease,  
    getPestDiseaseById,
    updatePestDisease,
    deletePestDisease,
    createCultivation,
    getAllCultivation,
    getCultivationById,
    updateCultivation,
    deleteCultivation,
    createFarmingModel,
    getAllFarmingModel,
    getFarmingModelById,
    updateFarmingModel,
    deleteFarmingModel,
    getTopPestPredictions,
};