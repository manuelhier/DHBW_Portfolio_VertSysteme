import logging from "logging";

import { findRooms, createRoom, findRoom, updateRoom, deleteRoom } from "../services/room.service.js";
import { RoomPatchModel, RoomId } from "../model/room.model.js";

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
    try {
        const roomId = new RoomId({ id: req.params.id });

        logger.info(`GET /room/${roomId.id}`);

        var room = findRoom(roomId.id);
        if (room === null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `Room with id '${roomId.id}' not found`
                }
            });
        }

        return res.status(200).json(room);
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function updateRoomHandler(req, res) {
    try {
        const roomId = new RoomId({ id: req.params.id });
        const room = new RoomPatchModel(req.body);

        logger.info(`PATCH /room/${roomId.id}`);

        await roomId.validate();
        await room.validate();

        var updateDevice = await updateRoom(roomId.id, room);
        if (updateDevice === null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `Room with id '${roomId.id}' not found`
                }
            });
        }

        return res.status(200).json(updateDevice);
    } catch (error) {
        // Validation Error or Internal Server Error
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}

export function deleteRoomHandler(req, res) {
    try {
        const roomId = new RoomId({ id: req.params.id });

        logger.info(`DELETE /room/${roomId.id}`);

        roomId.validate();

        var deletedRoom = deleteRoom(roomId.id);
        if (deletedRoom === null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `Room with id '${roomId.id}' not found`
                }
            });
        }

        return res.status(200).json("Room successfully deleted");
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}