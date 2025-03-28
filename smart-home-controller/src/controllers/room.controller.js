import logging from "logging";

import { RoomId, RoomPostModel, RoomPatchModel, RoomModel } from "../model/room.model.js";
import { RoomService } from "../services/room.service.js";

const logger = logging.default("room-controller");

const roomService = new RoomService();

export async function getRoomsHandler(_req, res, next) {
    try {
        logger.info("GET /room");

        const rooms = await roomService.getAllRooms();
        return res.status(200).json(rooms);
    } catch (error) {
        next(error);
    }
}

export async function createRoomHandler(req, res, next) {
    try {
        logger.info("POST /room");

        const roomPost = new RoomPostModel(req.body);
        await roomPost.validate();
        
        const createdRoom = await roomService.createRoom(roomPost);
        return res.status(201).json(createdRoom);
    } catch (error) {
        next(error);
    }
}

export async function getRoomHandler(req, res, next) {
    try {
        logger.info(`GET /room/${req.params.id}`);

        const roomId = new RoomId({ id: req.params.id });
        await roomId.validate();

        const room = await roomService.getRoomById(roomId.id);
        return res.status(200).json(room);
    } catch (error) {
        next(error);
    }
}

export async function updateRoomHandler(req, res, next) {
    try {
        logger.info(`PATCH /room/${req.params.id}`);

        const roomId = new RoomId({ id: req.params.id });
        await roomId.validate();

        const roomPatch = new RoomPatchModel(req.body);
        await roomPatch.validate();

        const updatedRoom = await roomService.updateRoom(roomId.id, roomPatch);
        return res.status(200).json(updatedRoom);
    } catch (error) {
        next(error);
    }
}

export async function deleteRoomHandler(req, res, next) {
    try {
        logger.info(`DELETE /room/${req.params.id}`);

        const roomId = new RoomId({ id: req.params.id });
        await roomId.validate();

        await roomService.deleteRoom(roomId.id)
        return res.status(200).send();
    } catch (error) {
        next(error);
    }
}