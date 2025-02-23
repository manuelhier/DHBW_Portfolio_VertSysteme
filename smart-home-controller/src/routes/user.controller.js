import express from "express";
import logging from "logging";

const logger = logging.default("user-controller");
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
 *             $ref: '#/components/schemas/UserInput'
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
 *             $ref: '#/components/schemas/UserInput'
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

function getUser(_req, res) {
    logger.info("Getting all users");
    res.send("Getting all users");
}

function createUser(_req, res) {
    logger.info("Creating a user");
    res.send("Creating a user");
}

function getUserById(req, res) {
    logger.info(`GET /user/${req.params.id}`);
    res.send(`GET /user/${req.params.id}`);
}

function updateUserById(req, res) {
    logger.info(`PATCH /user/${req.params.id}`);
    res.send(`PATCH /user/${req.params.id}`);
}

function deleteUserById(req, res) {
    logger.info(`DELETE /user/${req.params.id}`);
    res.send(`DELETE /user/${req.params.id}`);
}

export default userController;

