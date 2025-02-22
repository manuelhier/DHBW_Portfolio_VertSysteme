import express from "express";
import logging from "logging";

const logger = logging.default("room-controller");
const roomController = express.Router();

// Room Collection Endpoints
roomController.get('/room', getRoom);
roomController.post('/room', createRoom);

// Room Ressource Endpoints
roomController.get('/room/:id', getRoomById);
roomController.patch('/room/:id', updateRoomById);
roomController.delete('/room/:id', deleteRoomById);

function getRoom(_req, res) {
    logger.info("Getting all rooms");
    res.send("Getting all rooms");
}

function createRoom(_req, res) {
    logger.info("Creating a room");
    res.send("Creating a room");
}

function getRoomById(req, res) {
    logger.info(`GET /room/${req.params.id}`);
    res.send(`GET /room/${req.params.id}`);
}

function updateRoomById(req, res) {
    logger.info(`PATCH /room/${req.params.id}`);
    res.send(`PATCH /room/${req.params.id}`);
}

function deleteRoomById(req, res) {
    logger.info(`DELETE /room/${req.params.id}`);
    res.send(`DELETE /room/${req.params.id}`);
}

export default roomController;

