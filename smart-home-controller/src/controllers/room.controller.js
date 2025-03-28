import logging from "logging";

import { RoomId, RoomPostModel, RoomPatchModel, RoomModel } from "../model/room.model.js";
import { RoomDatabaseService } from "../utils/database.js";
import { DeviceMqttService, RoomMqttService } from "../utils/mqtt.js";

import { DeviceModel } from "../model/device.model.js";
import { UserModel } from "../model/user.model.js";
import { BadRequestError, NotFoundError } from "../utils/apiErrors.js";

const logger = logging.default("room-controller");
const databaseService = new RoomDatabaseService();
const mqttRoomService = new RoomMqttService();
const mqttDeviceService = new DeviceMqttService();

export async function getRoomsHandler(_req, res, next) {
    try {
        logger.info("GET /room");

        var rooms = await databaseService.findAllDocuments();

        mqttRoomService.publishMqttMessage("GET /room");
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

        var createdRoom = await RoomModel.create(roomPost);
        if (createdRoom === null) {
            throw new Error(`Room could not be created`);
        }

        mqttRoomService.publishMqttMessage(`Created room : ` + JSON.stringify(createdRoom, null, '\t'));
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

        var room = await databaseService.findDocument(roomId.id);
        if (room === null) {
            throw new NotFoundError(`Room with id '${roomId.id}' not found`)
        }

        mqttRoomService.publishMqttMessage(`GET /room/${roomId.id}`);
        return res.status(200).json(room);
    } catch (error) {
        next(error);
    }
}

export async function updateRoomHandler(req, res, next) {
    try {
        logger.info(`PATCH /room/${roomId.id}`);

        const roomId = new RoomId({ id: req.params.id });
        await roomId.validate();

        const roomPatch = new RoomPatchModel(req.body);
        await roomPatch.validate();

        var existingRoom = await databaseService.findDocument(roomId.id);
        if (existingRoom === null) {
            throw new BadRequestError(`Room with id '${roomId.id}' not found`);
        }

        if (roomPatch.name && roomPatch.name !== existingRoom.name) {
            existingRoom.name = roomPatch.name;
        }

        if (roomPatch.type && roomPatch.type !== existingRoom.type) {
            existingRoom.type = roomPatch.type;
        }

        existingRoom.updatedAt = new Date();

        var updatedRoom = await databaseService.saveDocument(existingRoom);
        if (updatedRoom === null) {
            throw new Error(`Room with id '${roomId.id}' could not be updated`);
        }

        mqttRoomService.publishMqttMessage(`Updated room : ` + updatedRoom);
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

        var deletedRoom = await databaseService.deleteDocument(roomId.id);
        if (deletedRoom === null) {
            throw new NotFoundError(`Room with id '${roomId.id}' not found`);
        }

        mqttRoomService.publishMqttMessage(`Deleted room : ` + JSON.stringify(deletedRoom.id));

        // Set roomId null for all associated devices
        if (deletedRoom.deviceList.length !== 0) {
            for (var device of deletedRoom.deviceList) {                
                var device = await DeviceModel.findById(device).exec();
                device.roomId = null;
                await device.save();

                mqttDeviceService.publishMqttMessage(`Updated device : ` + device)
            }
        }

        // Remove roomId from all associated users and their allowedRooms list
        var associatedUsers = await UserModel.find({ allowedRooms: roomId.id }).exec();
        for (var user of associatedUsers) {
            user.allowedRooms = user.allowedRooms.filter(id => id !== roomId.id);
            await user.save();
        }

        return res.status(200).send();
    } catch (error) {
        next(error);
    }
}