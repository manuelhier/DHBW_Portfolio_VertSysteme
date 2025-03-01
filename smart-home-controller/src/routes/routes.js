import express from 'express';

import { getDeviceHandler, createDeviceHandler, getDevicesHandler, updateDeviceHandler, deleteDeviceHandler } from '../controllers/device.controller.js';
import { getRoom, createRoom, getRoomById, updateRoomById, deleteRoomById } from '../controllers/room.controller.js';
import { getUser, createUser, getUserById, updateUserById, deleteUserById } from '../controllers/user.controller.js';

const deviceController = express.Router();
const roomController = express.Router();
const userController = express.Router();

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

// Room Collection Endpoints

/**
 * @openapi
 * /api/v1/room:
 *   get:
 *     tags:
 *       - Room
 *     summary: Get all rooms
 *     description: Get all rooms
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
roomController.get('/room', getRoom);

/**
 * @openapi
 * /api/v1/room:
 *   post:
 *     tags:
 *       - Room
 *     summary: Create a new room
 *     description: Create a new room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomPost'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Bad Request
 */
roomController.post('/room', createRoom);

// Room Ressource Endpoints

/**
 * @openapi
 * /api/v1/room/{id}:
 *   get:
 *     tags:
 *       - Room
 *     summary: Get a room by ID
 *     description: Get a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
roomController.get('/room/:id', getRoomById);

/**
 * @openapi
 * /api/v1/room/{id}:
 *   patch:
 *     tags:
 *       - Room
 *     summary: Update a room by ID
 *     description: Update a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomPost'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
roomController.patch('/room/:id', updateRoomById);

/**
 * @openapi
 * /api/v1/room/{id}:
 *   delete:
 *     tags:
 *       - Room
 *     summary: Delete a room by ID
 *     description: Delete a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
roomController.delete('/room/:id', deleteRoomById);

// User Collection Endpoints

/**
 * @openapi
 * /api/v1/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
userController.get('/user', getUser);

/**
 * @openapi
 * /api/v1/user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPost'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 */
userController.post('/user', createUser);

// User Ressource Endpoints

/**
 * @openapi
 * /api/v1/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get a user by ID
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
userController.get('/user/:id', getUserById);

/**
 * @openapi
 * /api/v1/user/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update a user by ID
 *     description: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPost'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
userController.patch('/user/:id', updateUserById);

/**
 * @openapi
 * /api/v1/user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a user by ID
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request
 */
userController.delete('/user/:id', deleteUserById);

export default [
    deviceController,
    roomController,
    userController
]