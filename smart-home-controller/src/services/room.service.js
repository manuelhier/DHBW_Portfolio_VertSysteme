import { RoomModel } from "../model/room.model.js";
import { DeviceModel } from "../model/device.model.js";
import { UserModel } from "../model/user.model.js";
import { DeviceMqttService, RoomMqttService, UserMqttService } from "../utils/mqtt.js";
import { NotFoundError, BadRequestError } from "../utils/apiErrors.js";

const mqttRoomService = new RoomMqttService();
const mqttDeviceService = new DeviceMqttService();
const mqttUserService = new UserMqttService()

export class RoomService {

    async getAllRooms() {
        const rooms = await RoomModel.find();
        mqttRoomService.notify('', 'GET', null, 'Fetched all rooms');
        return rooms;
    }

    async createRoom(roomPost) {
        // Create a new room in the database
        const createdRoom = await RoomModel.create(roomPost);
        if (!createdRoom) {
            throw new Error("Room could not be created");
        }

        mqttRoomService.notify(createdRoom.id, 'POST', roomPost, 'Created a new room');
        return createdRoom;
    }

    async getRoomById(roomId) {
        // Check if room exists
        const room = await RoomModel.findById(roomId);
        if (!room) {
            throw new NotFoundError(`Room with id '${roomId}' not found`);
        }

        mqttRoomService.notify(roomId, 'GET', null, 'Fetched room');
        return room;
    }

    async patchRoom(roomId, roomPatch) {
        // Check if existing room exists
        const existingRoom = await RoomModel.findById(roomId);
        if (!existingRoom) {
            throw new BadRequestError(`Room with id '${roomId}' not found`);
        }

        let isUpdated = false;

        // Update the room name if provided and different from the existing one
        if (roomPatch.name && roomPatch.name !== existingRoom.name) {
            existingRoom.name = roomPatch.name;
            isUpdated = true;
        }

        // Update the room type if provided and different from the existing one
        if (roomPatch.type && roomPatch.type !== existingRoom.type) {
            existingRoom.type = roomPatch.type;
            isUpdated = true;
        }

        if (isUpdated) {    
            existingRoom.updatedAt = new Date();
        } else {
            // Nothing changed
            return existingRoom;
        }
        
        // Save the updated room to the database
        const updatedRoom = await existingRoom.save();
        if (!updatedRoom) {
            throw new Error(`Room with id '${roomId}' could not be updated`);
        }

        mqttRoomService.notify(roomId, 'PATCH', roomPatch, 'Updated room');
        return updatedRoom;
    }

    async deleteRoom(roomId) {
        // Delete the room from the database
        const deletedRoom = await RoomModel.findByIdAndDelete(roomId);
        if (!deletedRoom) {
            throw new NotFoundError(`Room with id '${roomId}' not found`);
        }

        mqttRoomService.notify(roomId, 'DELETE', null, 'Deleted room');

        // Set roomId to null for all associated devices
        if (deletedRoom.deviceList.length) {
            for (const deviceId of deletedRoom.deviceList) {
                const device = await DeviceModel.findById(deviceId).exec();
                device.roomId = null;
                await device.save();
                mqttDeviceService.notify(deviceId, 'PATCH', { roomId: null }, `Updated device room association`); 
            }
        }

        // Remove roomId from all associated users and their allowedRooms list
        const associatedUsers = await UserModel.find({ allowedRooms: roomId }).exec();
        for (const user of associatedUsers) {
            user.allowedRooms = user.allowedRooms.filter(id => id !== roomId);
            await user.save();
            mqttUserService.notify(user.id, 'PATCH', { allowedRooms: user.allowedRooms }, `Updated user allowedRooms association`);
        }
    }
}