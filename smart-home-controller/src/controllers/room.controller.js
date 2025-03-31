import logging from "logging";

import { RoomId, RoomPostModel, RoomPatchModel } from "../model/room.model.js";
import { RoomService } from "../services/room.service.js";

import { BadRequestError } from "../utils/apiErrors.js";

const logger = logging.default("room-controller");
const roomService = new RoomService();

export async function getRoomsHandler(_req, res, next) {
    try {
        logger.info("GET /room");

        // Get all rooms
        const rooms = await roomService.getAllRooms();
        return res.status(200).json(rooms);
    } catch (error) {
        next(error);
    }
}

export async function createRoomHandler(req, res, next) {
    try {
        logger.info("POST /room");

        // Validate the request body
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError(`Body is required`);
        }

        // Check for valid keys in the request body
        let validKeys = ["name", "type"];
        for (const key in req.body) {
            if (!validKeys.includes(key)) {
                throw new BadRequestError(`Invalid field: ${key}`);
            }
        }

        // Create and validate the RoomPostModel
        const roomPost = new RoomPostModel(req.body);
        await roomPost.validate().catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Create the room
        const createdRoom = await roomService.createRoom(roomPost);
        return res.status(201).json(createdRoom);
    } catch (error) {
        next(error);
    }
}

export async function getRoomHandler(req, res, next) {
    try {
        logger.info(`GET /room/${req.params.id}`);

        // Create and validate the RoomId
        const roomId = new RoomId({ id: req.params.id });
        await roomId.validate().catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Get the room
        const room = await roomService.getRoomById(roomId.id);
        return res.status(200).json(room);
    } catch (error) {
        next(error);
    }
}

export async function patchRoomHandler(req, res, next) {
    try {
        logger.info(`PATCH /room/${req.params.id}`);

        // Validate the request body
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError(`Body is required`);
        }

        // Check for valid keys in the request body
        let validKeys = ["name", "type"];
        for (const key in req.body) {
            if (!validKeys.includes(key)) {
                throw new BadRequestError(`Invalid field: ${key}`);
            }
        }

        // Create and validate the RoomId and RoomPatchModel
        const roomId = new RoomId({ id: req.params.id });
        const roomPatch = new RoomPatchModel(req.body);
        await Promise.all([
            roomId.validate(),
            roomPatch.validate()
        ]).catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Patch the room
        const updatedRoom = await roomService.patchRoom(roomId.id, roomPatch);
        if (!updatedRoom) {
            return res.status(204).send();
        }
        
        return res.status(200).json(updatedRoom);
    } catch (error) {
        next(error);
    }
}

export async function deleteRoomHandler(req, res, next) {
    try {
        logger.info(`DELETE /room/${req.params.id}`);

        // Create and validate the RoomId
        const roomId = new RoomId({ id: req.params.id });
        await roomId.validate().catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Delete the room
        await roomService.deleteRoom(roomId.id)
        return res.status(200).send();
    } catch (error) {
        next(error);
    }
}