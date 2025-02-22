import express from "express";
import logging from "logging";

const logger = logging.default("device-controller");
const deviceController = express.Router();

// Device Collection Endpoints
deviceController.get('/device', getDevice);
deviceController.post('/device', createDevice);

// Device Ressource Endpoints
deviceController.get('/device/:id', getDeviceById);
deviceController.patch('/device/:id', updateDeviceById);
deviceController.delete('/device/:id', deleteDeviceById);


function getDevice(_req, res) {
    logger.info("Getting all devices");
    res.send("Getting all devices");
}

function createDevice(_req, res) {
    logger.info("Creating a device");
    res.send("Creating a device");
}

function getDeviceById(req, res) {
    logger.info(`GET /device/${req.params.id}`);
    res.send(`GET /device/${req.params.id}`);
}

function updateDeviceById(req, res) {
    logger.info(`PATCH /device/${req.params.id}`);
    res.send(`PATCH /device/${req.params.id}`);
}

function deleteDeviceById(req, res) {
    logger.info(`DELETE /device/${req.params.id}`);
    res.send(`DELETE /device/${req.params.id}`);
}

export default deviceController;

