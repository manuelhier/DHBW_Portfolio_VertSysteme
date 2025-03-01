import express from 'express';

import { getRoom, createRoom, getRoomById, updateRoomById, deleteRoomById } from '../controllers/room.controller.js';

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

export default roomController;