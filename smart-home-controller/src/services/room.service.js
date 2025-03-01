import logging from 'logging';

import { RoomPostModel, RoomPatchModel, RoomModel } from "../model/room.model.js";

const logger = logging.default('room-service');

export async function findRooms() {
    try {
        const result = await RoomModel.find();
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

export async function createRoom(input) {

    let room = new RoomPostModel(input);

    try {
        room = new RoomModel(room);
        var result = await room.save();
        logger.info("Creating a room: ", result);
        return result;
    } catch (err) {
        logger.error("Error creating a room: ", err, '\n', room);
        throw err;
    }

}

export async function findRoom(id) {
    try {
        const result = await RoomModel.findById(id);
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

export async function updateRoom(id, input) {

    const roomUpdate = new RoomPatchModel(input, );

    logger.info("Updating a room: ", roomUpdate);

    try {
        var result = await RoomModel.findByIdAndUpdate(id, roomUpdate, { new: true });
        logger.info("Updating a room: ", result);
        return result;
    }
    catch (err) {
        logger.error("Error updating a room: ", err, '\n', roomUpdate);
        throw err;
    }
}

export async function deleteRoom(id) {
    try {
        const result = await RoomModel.findByIdAndDelete(id);
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}