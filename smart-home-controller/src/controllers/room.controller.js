import logging from "logging";

import { RoomId, RoomPostModel, RoomPatchModel } from "../model/room.model.js";
import { RoomDatabaseService } from "../utils/database.js";
import { RoomMqttService } from "../utils/mqtt.js";

import { DeviceModel } from "../model/device.model.js";
import { UserModel } from "../model/user.model.js";
import { NotFoundError } from "../utils/apiErrors.js";

const logger = logging.default("room-controller");
const databaseService = new RoomDatabaseService();
const mqttService = new RoomMqttService();

export async function getRoomsHandler(_req, res, next) {
    try {
        logger.info("GET /room");
        var rooms = await databaseService.findAllDocuments();

        // Get devices in room
        for (var room of rooms) {
            const deviceList = await DeviceModel.find({ roomId: room.id }, 'id').exec();
            room.deviceList = deviceList.map(d => d.id);
        }
                
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
            throw new NotFoundError(`Room with id '${roomId.id}' not found`)
        }

        // Get devices in room
        const deviceList =  await DeviceModel.find({ roomId: roomId.id }, 'id').exec();
        room.deviceList = deviceList.map(d => d.id);

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

        if (roomPatch.type && roomPatch.type !== existingRoom.type) {
            existingRoom.type = roomPatch.type;
        }

        // if (roomPatch.deviceList && roomPatch.deviceList !== existingRoom.deviceList) {
        //     for (let device of roomPatch.deviceList) {
        //         if (!existingRoom.deviceList.includes(device)) {
        //             existingRoom.deviceList.push(device);
        //         }
        //     }

        //     for (let device of existingRoom.deviceList) {
        //         if (!roomPatch.deviceList.includes(device)) {
        //             existingRoom.deviceList = existingRoom.deviceList.filter(d => d !== device);
        //         }
        //     }
        // }

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

        // Remove roomId from all associated users and their allowedRooms list
        var associatedUsers = await UserModel.find( { allowedRooms : roomId.id }).exec();
        for (var user of associatedUsers) {
            user.allowedRooms = user.allowedRooms.filter(id => id !== roomId.id);
            await user.save();
        }

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

// export async function getRoomDevicesHandler(req, res, next) {
//     next(new Error("Not implemented"));
// }

// export async function createRoomDeviceHandler(req, res, next) {
//     next(new Error("Not implemented"));
// }

// export async function deleteRoomDeviceHandler(req, res, next) {
//     next(new Error("Not implemented"));
// }