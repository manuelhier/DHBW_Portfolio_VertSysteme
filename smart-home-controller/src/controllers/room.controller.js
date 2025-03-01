import logging from "logging";

const logger = logging.default("room-controller");

export function getRoom(_req, res) {
    logger.info("Getting all rooms");
    res.send("Getting all rooms");
}

export function createRoom(_req, res) {
    logger.info("Creating a room");
    res.send("Creating a room");
}

export function getRoomById(req, res) {
    logger.info(`GET /room/${req.params.id}`);
    res.send(`GET /room/${req.params.id}`);
}

export function updateRoomById(req, res) {
    logger.info(`PATCH /room/${req.params.id}`);
    res.send(`PATCH /room/${req.params.id}`);
}

export function deleteRoomById(req, res) {
    logger.info(`DELETE /room/${req.params.id}`);
    res.send(`DELETE /room/${req.params.id}`);
}