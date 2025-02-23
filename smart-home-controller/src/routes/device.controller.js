import express from "express";
import logging from "logging";
import DeviceInputModel from "../model/device.model.js";

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
deviceController.get('/device', getDevice);

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
 *             $ref: '#/components/schemas/DeviceInput'
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
deviceController.post('/device', createDevice);

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
deviceController.get('/device/:id', getDeviceById);

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
 *             $ref: '#/components/schemas/DeviceUpdate'
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
deviceController.patch('/device/:id', updateDeviceById);

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
deviceController.delete('/device/:id', deleteDeviceById);

function getDevice(_req, res) {
    logger.info("Getting all devices");
    res.send("Getting all devices");
}

function createDevice(req, res) {

    const device = new DeviceInputModel(req.body);

    logger.info("Creating a device");
    res.send(device);
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

