const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../models');
const { v4: uuidv4 } = require('uuid');

const handlePestDetection = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const imageFile = req.files.image;
        const predictionLabel = req.body.prediction;
        const confidenceScore = parseFloat(req.body.confidence || "0");
        const userId = req.body.userId || null;

        // Save the image to disk
        const uploadDir = path.join(__dirname, '../../public/uploads/pest-images');

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const uniqueFilename = `${uuidv4()}-${imageFile.name}`;
        const imagePath = path.join(uploadDir, uniqueFilename);
        const relativeImagePath = `/uploads/pest-images/${uniqueFilename}`;

        // Save the file
        await imageFile.mv(imagePath);

        // Save prediction to database
        const savedPrediction = await db.PestPrediction.create({
            image_path: relativeImagePath,
            prediction_label: predictionLabel,
            confidence_score: confidenceScore,
            user_id: userId
        });

        // Find detailed disease information
        const diseaseInfo = await db.PestDisease.findOne({
            where: {
                name: predictionLabel
            },
            include: [
                {
                    model: db.PestCategory,
                    as: 'category'
                },
                {
                    model: db.PestDiseaseImage,
                    as: 'images'
                },
                {
                    model: db.GrowthStage,
                    as: 'growthStages'
                }
            ]
        });

        return res.status(200).json({
            success: true,
            prediction: savedPrediction,
            diseaseInfo: diseaseInfo || null
        });
    } catch (error) {
        console.error('Error in pest detection:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing pest detection',
            error: error.message
        });
    }
};

// Optional: Helper function to send image to FastAPI model
const sendImageToModel = async (imageBuffer) => {
    try {
        const formData = new FormData();
        formData.append('file', new Blob([imageBuffer]), 'image.jpg');

        const response = await axios.post('http://localhost:8000/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error sending image to model:', error);
        throw error;
    }
};

module.exports = {
    handlePestDetection
}; 