import express from 'express';

import { getDeviceHandler, createDeviceHandler, getDevicesHandler, updateDeviceHandler, deleteDeviceHandler } from '../controllers/device.controller.js';

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
 *             $ref: '#/components/requestBodies/DevicePost'
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
 *             $ref: '#/components/requestBodies/DevicePatch'
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

export default deviceController;