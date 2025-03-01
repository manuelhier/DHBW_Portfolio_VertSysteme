import express from 'express';

import { getUsersHandler, createUsersHandler, getUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/user.controller.js';

const userController = express.Router();

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
userController.get('/user', getUsersHandler);

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
userController.post('/user', createUsersHandler);

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
userController.get('/user/:id', getUserHandler);


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
 *             $ref: '#/components/schemas/UserPatch'
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
userController.patch('/user/:id', updateUserHandler);

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
userController.delete('/user/:id', deleteUserHandler);

export default userController;