import { DeviceId, DevicePostModel, DevicePatchModel } from "../model/device.model.js";
import { RoomModel } from "../model/room.model.js";
import { DeviceDatabaseService } from "../utils/database.js";
import { DeviceMqttService, RoomMqttService } from "../utils/mqtt.js";
import { BadRequestError, NotFoundError } from "../utils/apiErrors.js";

const databaseService = new DeviceDatabaseService();
const mqttDeviceService = new DeviceMqttService();
const mqttRoomService = new RoomMqttService();

export const ALLOWED_DEVICES_AND_STATES = {
    "lightswitch": {
        "allowedStates": ["on", "off"],
        "defaultState": "off"
    },
    "thermostat": {
        "allowedStates": ["on", "off"],
        "defaultState": "off"
    },
    "smart-lock": {
        "allowedStates": ["locked", "unlocked"],
        "defaultState": "locked"
    },
    "window-shade": {
        "allowedStates": ["open", "closed"],
        "defaultState": "closed"
    },
    "window-sensor": {
        "allowedStates": ["open", "closed"],
        "defaultState": "closed"
    },
    "door-sensor": {
        "allowedStates": ["open", "closed"],
        "defaultState": "closed"
    }
};

function validateDeviceStatus(deviceType, deviceStatus) {
    const type = ALLOWED_DEVICES_AND_STATES[deviceType];

    if (!type || !type.allowedStates.includes(deviceStatus)) {
        throw new BadRequestError(`Invalid status '${deviceStatus}' for device type '${deviceType}'. Valid status: ${type.allowedStates.join(' / ')}.`);
    }
}

export class DeviceService {
    async getAllDevices() {
        const devices = await databaseService.findAllDocuments();
        mqttDeviceService.publishMqttMessage(`GET /device: ${JSON.stringify(devices, null, '\t')}`);
        return devices;
    }

    async createDevice(devicePost) {
        // Check if type is of supported
        const supportedTypes = Object.keys(ALLOWED_DEVICES_AND_STATES);
        if (!devicePost.type || !supportedTypes.includes(devicePost.type)) {
            throw new BadRequestError(`Type '${devicePost.type}' not supported. Supported types: ${supportedTypes.join(", ")}`);
        }

        // Check if room exists
        let associatedRoom = null;
        if (devicePost.roomId) {
            associatedRoom = await RoomModel.findById(devicePost.roomId).exec();
            if (!associatedRoom) {
                throw new BadRequestError(`Room '${devicePost.roomId}' does not exist.`);
            }
        }

        const createdDevice = await databaseService.createDocument(devicePost);
        if (!createdDevice) {
            throw new Error("Device could not be created");
        }

        mqttDeviceService.publishMqttMessage(`Created device: ${JSON.stringify(createdDevice, null, '\t')}`);

        // Add device to newly associated room
        if (associatedRoom && !associatedRoom.deviceList.includes(createdDevice.id)) {
            associatedRoom.deviceList.push(createdDevice.id);
            await associatedRoom.save();
            mqttRoomService.publishMqttMessage(`Updated room: ${JSON.stringify(associatedRoom, null, '\t')}`);
        }

        return createdDevice;
    }

    async getDeviceById(deviceId) {
        const device = await databaseService.findDocument(deviceId);
        if (!device) {
            throw new Error(`Device with id '${deviceId}' not found`);
        }

        mqttDeviceService.publishMqttMessage(`GET /device/${deviceId}: ${JSON.stringify(device, null, '\t')}`);
        return device;
    }

    async updateDevice(deviceId, devicePatch) {
        const existingDevice = await databaseService.findDocument(deviceId);
        if (!existingDevice) {
            throw new Error(`Device with id '${deviceId}' not found`);
        }

        if (devicePatch.name && devicePatch.name !== existingDevice.name) {
            existingDevice.name = devicePatch.name;
        }

        let newRoom = null;
        let previousRoom = null;

        // Check if roomId was changed
        if (devicePatch.roomId && devicePatch.roomId !== existingDevice.roomId) {
            newRoom = await RoomModel.findById(devicePatch.roomId).exec();

            // Check if new room exists
            if (!newRoom) {
                throw new BadRequestError(`Room '${devicePatch.roomId}' does not exist.`);
            }

            // Get previous room by id
            previousRoom = await RoomModel.findById(existingDevice.roomId).exec();

            existingDevice.roomId = devicePatch.roomId;
        }

        if (devicePatch.status && devicePatch.status !== existingDevice.status) {
            validateDeviceStatus(existingDevice.type, devicePatch.status);
            existingDevice.status = devicePatch.status;
        }

        existingDevice.updatedAt = new Date();

        // Overwrite device with changes
        const updatedDevice = await databaseService.saveDocument(existingDevice);
        if (!updatedDevice) {
            throw new Error(`Device with id '${deviceId}' could not be updated`);
        }

        mqttDeviceService.publishMqttMessage(`Updated device: ${JSON.stringify(updatedDevice, null, '\t')}`);

        // Add device to newly associated room
        if (newRoom && !newRoom.deviceList.includes(updatedDevice.id)) {
            newRoom.deviceList.push(updatedDevice.id);
            await newRoom.save();
            mqttRoomService.publishMqttMessage(`Updated room: ${JSON.stringify(newRoom, null, '\t')}`);
        }

        // Remove device from previously associated room
        if (previousRoom && previousRoom.deviceList.includes(updatedDevice.id)) {
            previousRoom.deviceList = previousRoom.deviceList.filter(d => d !== updatedDevice.id);
            await previousRoom.save();
            mqttRoomService.publishMqttMessage(`Updated room: ${JSON.stringify(previousRoom, null, '\t')}`);
        }

        return updatedDevice;
    }

    async deleteDevice(deviceId) {
        const device = await databaseService.findDocument(deviceId);
        if (!device) {
            throw new NotFoundError(`Device with id '${deviceId}' not found`);
        }

        let associatedRoom = null;
        if (device.roomId) {
            associatedRoom = await RoomModel.findById(device.roomId).exec();
        }

        const deletedDevice = await databaseService.deleteDocument(deviceId);
        if (!deletedDevice) {
            throw new Error(`Device with id '${deviceId}' could not be deleted`);
        }

        mqttDeviceService.publishMqttMessage(`Deleted device: ${JSON.stringify(deletedDevice, null, '\t')}`);

        // Remove deviceId from the associated room's device list
        if (associatedRoom && associatedRoom.deviceList.includes(deviceId)) {
            associatedRoom.deviceList = associatedRoom.deviceList.filter(id => id !== deviceId);
            await associatedRoom.save();
            mqttRoomService.publishMqttMessage(`Updated room: ${JSON.stringify(associatedRoom, null, '\t')}`);
        }
    }
}