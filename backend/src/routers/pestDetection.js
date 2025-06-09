const express = require('express');
const pestDetectionController = require('../controllers/pestDetectionController');

const router = express.Router();

module.exports = (app) => {
    router.post('/api/pest-detection', pestDetectionController.handlePestDetection);

    return app.use('/', router);
};