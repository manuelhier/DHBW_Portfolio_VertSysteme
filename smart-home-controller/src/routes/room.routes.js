import express from 'express';

import { getRoomsHandler, createRoomHandler, getRoomHandler, updateRoomHandler, deleteRoomHandler } from '../controllers/room.controller.js';

const roomController = express.Router();

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
roomController.get('/room', getRoomsHandler);

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
roomController.post('/room', createRoomHandler);

/**
 * @openapi
 * /api/v1/room/{id}/devices:
 *   post:
 *     tags:
 *       - Room
 *     summary: Add a device to a room
 *     description: Add a new device to a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *       - in: query
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the device to add to the room
 *     responses:
 *       200:
 *         description: Device successfully added to room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 roomId:
 *                   type: string
 *                 deviceId:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing parameters or invalid IDs
 *       404:
 *         description: Room or device not found
 */
roomController.post('/room/:id/devices', (res) => {
    res.status(200).json({ message: 'POST /room/devices' });
});

/**
 * @openapi
 * /api/v1/room/{id}/devices/{deviceId}:
 *   delete:
 *     tags:
 *       - Room
 *     summary: Remove a device from a room
 *     description: Remove a specific device from a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the device to remove from the room
 *     responses:
 *       200:
 *         description: Device successfully removed from room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 roomId:
 *                   type: string
 *                 deviceName:
 *                   type: string
 *       400:
 *         description: Bad Request - Invalid parameters
 *       404:
 *         description: Room or device not found
 */
roomController.delete('/room/:id/devices/:deviceId', (res) => {
    res.status(200).json({ message: 'DELETE /room/devices' });
});



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
roomController.get('/room/:id', getRoomHandler);

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
 *             $ref: '#/components/schemas/RoomPatch'
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
roomController.patch('/room/:id', updateRoomHandler);

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
roomController.delete('/room/:id', deleteRoomHandler);

export default roomController;