import logging from "logging";

import { RoomPostModel, RoomPatchModel, RoomId } from "../model/room.model.js";
import { RoomDatabaseService } from "../utils/database.js";
import { RoomMqttService } from "../utils/mqtt.js";

const logger = logging.default("room-controller");
const databaseService = new RoomDatabaseService();
const mqttService = new RoomMqttService();

export async function getRoomsHandler(_req, res, next) {
    try {
        logger.info("GET /room");
        const rooms = await databaseService.findAllDocuments();

        return res.status(200).json(rooms);
    } catch (error) {
        next(error);
    }
}

export async function createRoomHandler(req, res, next) {
    try {
        const room = new RoomPostModel(req.body);
        logger.info("POST /room");

        await room.validate();

        var createdRoom = await databaseService.createDocument(room);
        if (createdRoom === null) {
            throw new Error(`Room could not be created`);
        }
        
        mqttService.publishMqttMessage(`Created room : ` + JSON.stringify(createdRoom));

        return res.status(201).json(createdRoom);
    } catch (error) {
        next(error);
    }
}

export async function getRoomHandler(req, res, next) {
    try {
        const roomId = new RoomId({ id: req.params.id });
        logger.info(`GET /room/${roomId.id}`);

        await roomId.validate();

        var room = await databaseService.findDocument(roomId.id);
        if (room === null) {
            throw new Error(`Room with id '${roomId.id}' not found`);
        }

        return res.status(200).json(room);
    } catch (error) {
        next(error);
    }
}

export async function updateRoomHandler(req, res, next) {
    try {
        const roomId = new RoomId({ id: req.params.id });
        const roomPatch = new RoomPatchModel(req.body);

        logger.info(`PATCH /room/${roomId.id}`);

        await roomId.validate();
        await roomPatch.validate();

        var existingRoom = await databaseService.findDocument(roomId.id);
        if (existingRoom === null) {
            throw new Error(`Room with id '${roomId.id}' not found`);
        }

        if (roomPatch.name && roomPatch.name !== existingRoom.name) {
            existingRoom.name = roomPatch.name;
        }

        if (roomPatch.owner && roomPatch.owner !== existingRoom.owner) {
            existingRoom.owner = roomPatch.owner;
        }

        if (roomPatch.devices && roomPatch.devices !== existingRoom.devices) {
            for (let device of roomPatch.devices) {
                if (!existingRoom.devices.includes(device)) {
                    existingRoom.devices.push(device);
                }
            }

            for (let device of existingRoom.devices) {
                if (!roomPatch.devices.includes(device)) {
                    existingRoom.devices = existingRoom.devices.filter(d => d !== device);
                }
            }
        }

        existingRoom.updatedAt = new Date();

        logger.info(`Updated room : ` + JSON.stringify(existingRoom));

        var updatedRoom = await databaseService.saveDocument(existingRoom);
        if (updatedRoom === null) {
            throw new Error(`Room with id '${roomId.id}' could not be updated`);
        }

        mqttService.publishMqttMessage(`Updated room : ` + JSON.stringify(updatedRoom));

        return res.status(200).json(updatedRoom);
    } catch (error) {
        next(error);
    }
}

export async function deleteRoomHandler(req, res, next) {
    try {
        const roomId = new RoomId({ id: req.params.id });
        logger.info(`DELETE /room/${roomId.id}`);

        await roomId.validate();

        var deletedRoom = await databaseService.deleteDocument(roomId.id);
        if (deletedRoom === null) {
            throw new Error(`Room with id '${roomId.id}' not found`);
        }

        mqttService.publishMqttMessage(`Deleted room : ` + JSON.stringify(deletedRoom));

        return res.status(200).json("Room successfully deleted");
    } catch (error) {
        next(error);
    }
}

export async function getRoomDevicesHandler(req, res, next) {

}

export async function createRoomDeviceHandler(req, res, next) {

}

export async function deleteRoomDeviceHandler(req, res, next) {

}

export async function getRoomUsersHandler(req, res, next) {
    
}

export async function createRoomUserHandler(req, res, next) {

}

export async function deleteRoomUserHandler(req, res, next) {

}