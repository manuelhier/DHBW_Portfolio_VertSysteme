import logging from "logging";
import { findDevices, createDevice, findDevice, updateDevice, deleteDevice } from "../services/device.service.js";

const logger = logging.default("device-controller");

export function getDevicesHandler(_req, res) {
    logger.info("GET /device");
    
    findDevices()
        .then(devices => {
            res.status(200).json(devices);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function createDeviceHandler(req, res) {
    logger.info("POST /device");

    createDevice(req.body)
        .then(savedDevice => {
            res.status(201).json(savedDevice);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function getDeviceHandler(req, res) {
    logger.info(`GET /device/${req.params.id}`);

    findDevice(req.params.id)
        .then(device => {
            res.status(200).json(device);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function updateDeviceHandler(req, res) {
    logger.info(`PATCH /device/${req.params.id}`);

    updateDevice(req.params.id, req.body)
    .then(updatedDevice => {
        res.status(200).json(updatedDevice);
    })
    .catch(error => {
        res.status(400).json({ error: error.message });
    });
}

export function deleteDeviceHandler(req, res) {
    logger.info(`DELETE /device/${req.params.id}`);
    
    deleteDevice(req.params.id)
        .then( () => {
            res.status(200);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}
