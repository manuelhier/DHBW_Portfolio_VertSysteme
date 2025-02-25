import express from "express";
import logging from "logging";
import { findDevices, createDevice, findDevice, updateDevice, deleteDevice } from "../services/device.service.js";

const logger = logging.default("device-controller");
const deviceController = express.Router();

// Device Collection Endpoints

/**
 * @openapi
 * /api/v1/device:
 *   get:
 *     tags:
 *       - Device
 *     summary: Get all devices
 *     description: Get all devices
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
deviceController.get('/device', getDevicesHandler);

/**
 * @openapi
 * /api/v1/device:
 *   post:
 *     tags:
 *       - Device
 *     summary: Create a new device
 *     description: Create a new device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DevicePost'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Bad Request
 */
deviceController.post('/device', createDeviceHandler);

// Device Ressource Endpoints

/**
 * @openapi
 * /api/v1/device/{id}:
 *   get:
 *     tags:
 *       - Device
 *     summary: Get a device by ID
 *     description: Get a device by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The device ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
deviceController.get('/device/:id', getDeviceHandler);

/**
 * @openapi
 * /api/v1/device/{id}:
 *   patch:
 *     tags:
 *       - Device
 *     summary: Update a device by ID
 *     description: Update a device by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DevicePatch'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
deviceController.patch('/device/:id', updateDeviceHandler);

/**
 * @openapi
 * /api/v1/device/{id}:
 *   delete:
 *     tags:
 *       - Device
 *     summary: Delete a device by ID
 *     description: Delete a device by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The device ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
deviceController.delete('/device/:id', deleteDeviceHandler);

function getDevicesHandler(_req, res) {
    logger.info("GET /device");
    
    findDevices()
        .then(devices => {
            res.status(200).json(devices);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

function createDeviceHandler(req, res) {
    logger.info("POST /device");

    createDevice(req.body)
        .then(savedDevice => {
            res.status(201).json(savedDevice);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

function getDeviceHandler(req, res) {
    logger.info(`GET /device/${req.params.id}`);

    findDevice(req.params.id)
        .then(device => {
            res.status(200).json(device);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

function updateDeviceHandler(req, res) {
    logger.info(`PATCH /device/${req.params.id}`);

    updateDevice(req.params.id, req.body)
    .then(updatedDevice => {
        res.status(200).json(updatedDevice);
    })
    .catch(error => {
        res.status(400).json({ error: error.message });
    });
}

function deleteDeviceHandler(req, res) {
    logger.info(`DELETE /device/${req.params.id}`);
    
    deleteDevice(req.params.id)
        .then( () => {
            res.status(200);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export default deviceController;

