import logging from "logging";

import { findRooms, createRoom, findRoom, updateRoom, deleteRoom } from "../services/room.service.js";

const logger = logging.default("room-controller");

export function getRoomsHandler(_req, res) {
    logger.info("GET /room");

    findRooms() 
        .then(rooms => {
            res.status(200).json(rooms);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function createRoomHandler(_req, res) {
    logger.info("POST /room");
    
    createRoom(_req.body)
        .then(savedRoom => {
            res.status(201).json(savedRoom);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function getRoomHandler(req, res) {
    logger.info(`GET /room/${req.params.id}`);

    findRoom(req.params.id)
        .then(room => {
            res.status(200).json(room);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function updateRoomHandler(req, res) {
    logger.info(`PATCH /room/${req.params.id}`);
    
    updateRoom(req.params.id, req.body)
        .then(updatedRoom => {
            res.status(200).json(updatedRoom);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function deleteRoomHandler(req, res) {
    logger.info(`DELETE /room/${req.params.id}`);
    
    deleteRoom(req.params.id)
        .then(() => {
            res.status(200);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}