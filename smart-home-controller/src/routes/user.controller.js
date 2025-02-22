import express from "express";
import logging from "logging";

const logger = logging.default("user-controller");
const userController = express.Router();

// User Collection Endpoints
userController.get('/user', getUser);
userController.post('/user', createUser);

// User Ressource Endpoints
userController.get('/user/:id', getUserById);
userController.patch('/user/:id', updateUserById);
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

