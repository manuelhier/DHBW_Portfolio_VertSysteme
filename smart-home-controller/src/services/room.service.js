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
        mqttRoomService.publishMqttMessage(`GET /room`);
        return rooms;
    }

    async createRoom(roomPost) {
        // Create a new room in the database
        const createdRoom = await RoomModel.create(roomPost);
        if (!createdRoom) {
            throw new Error("Room could not be created");
        }

        // Publish an MQTT message for the operation
        mqttRoomService.publishMqttMessage(`Created room: ${JSON.stringify(createdRoom, null, '\t')}`);
        return createdRoom;
    }

    async getRoomById(roomId) {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            throw new NotFoundError(`Room with id '${roomId}' not found`);
        }

        // Publish an MQTT message for the operation
        mqttRoomService.publishMqttMessage(`GET /room/${roomId}`);
        return room;
    }

    async updateRoom(roomId, roomPatch) {
        const existingRoom = await RoomModel.findById(roomId);
        if (!existingRoom) {
            throw new BadRequestError(`Room with id '${roomId}' not found`);
        }

        // Update the room's properties if they are provided in the patch
        if (roomPatch.name && roomPatch.name !== existingRoom.name) {
            existingRoom.name = roomPatch.name;
        }
        if (roomPatch.type && roomPatch.type !== existingRoom.type) {
            existingRoom.type = roomPatch.type;
        }

        // Update the timestamp for the room
        existingRoom.updatedAt = new Date();

        const updatedRoom = await existingRoom.save();
        if (!updatedRoom) {
            throw new Error(`Room with id '${roomId}' could not be updated`);
        }

        // Publish an MQTT message for the operation
        mqttRoomService.publishMqttMessage(`Updated room: ${JSON.stringify(updatedRoom, null, '\t')}`);
        return updatedRoom;
    }

    async deleteRoom(roomId) {
        const deletedRoom = await RoomModel.findByIdAndDelete(roomId);
        if (!deletedRoom) {
            throw new NotFoundError(`Room with id '${roomId}' not found`);
        }

        // Publish an MQTT message for the operation
        mqttRoomService.publishMqttMessage(`Deleted room: ${JSON.stringify(deletedRoom, null, '\t')}`);

        // Set roomId to null for all associated devices
        if (deletedRoom.deviceList.length) {
            for (const deviceId of deletedRoom.deviceList) {
                const device = await DeviceModel.findById(deviceId).exec();
                device.roomId = null;
                await device.save();
                mqttDeviceService.publishMqttMessage(`Updated device: ${JSON.stringify(device, null, '\t')}`);
            }
        }

        // Remove roomId from all associated users and their allowedRooms list
        const associatedUsers = await UserModel.find({ allowedRooms: roomId }).exec();
        for (const user of associatedUsers) {
            user.allowedRooms = user.allowedRooms.filter(id => id !== roomId);
            await user.save();
            mqttUserService.publishMqttMessage(`Updated user: ${JSON.stringify(user, null, '\t')}`)
        }
    }
}