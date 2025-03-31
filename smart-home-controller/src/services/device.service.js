import { DeviceModel } from "../model/device.model.js";
import { RoomModel } from "../model/room.model.js";
import { DeviceMqttService, RoomMqttService } from "../utils/mqtt.js";
import { BadRequestError, NotFoundError } from "../utils/apiErrors.js";

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
        const devices = await DeviceModel.find();
        mqttDeviceService.notify('', 'GET', null, 'Fetched all devices');
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

        // Create device in database
        const createdDevice = await DeviceModel.create(devicePost);
        if (!createdDevice) {
            throw new Error("Device could not be created");
        }

        mqttDeviceService.notify(createdDevice.id, 'POST', createdDevice, 'Created device');

        // Add device to newly associated room
        if (associatedRoom && !associatedRoom.deviceList.includes(createdDevice.id)) {
            associatedRoom.deviceList.push(createdDevice.id);
            await associatedRoom.save();
            mqttRoomService.notify(associatedRoom.id, null, null, 'Added device to ');
        }

        return createdDevice;
    }

    async getDeviceById(deviceId) {
        // Check if device exists
        const device = await DeviceModel.findById(deviceId);
        if (!device) {
            throw new NotFoundError(`Device with id '${deviceId}' not found`);
        }

        mqttDeviceService.notify(deviceId, 'GET', null, 'Fetched device');
        return device;
    }

    async patchDevice(deviceId, devicePatch) {
        // Check if existing device exists
        const existingDevice = await DeviceModel.findById(deviceId);
        if (!existingDevice) {
            throw new NotFoundError(`Device with id '${deviceId}' not found`);
        }

        let isUpdated = false;

        // Check if name was patched
        if (devicePatch.name && devicePatch.name !== existingDevice.name) {
            existingDevice.name = devicePatch.name;
            isUpdated = true;
        }

        let newRoom = null;
        let previousRoom = null;

        // Check if roomId was patched
        if (devicePatch.roomId && devicePatch.roomId !== existingDevice.roomId) {
            newRoom = await RoomModel.findById(devicePatch.roomId).exec();

            // Check if new room exists
            if (!newRoom) {
                throw new BadRequestError(`Room '${devicePatch.roomId}' does not exist.`);
            }

            // Get previous room by id
            previousRoom = await RoomModel.findById(existingDevice.roomId).exec();

            existingDevice.roomId = devicePatch.roomId;
            isUpdated = true;
        }

        // Check if status was patched
        if (devicePatch.status && devicePatch.status !== existingDevice.status) {
            validateDeviceStatus(existingDevice.type, devicePatch.status);
            existingDevice.status = devicePatch.status;
            isUpdated = true;
        }


        if (isUpdated) {
            existingDevice.updatedAt = new Date();
        } else {
            // No changes to save
            return existingDevice;
        }

        // Overwrite device with changes
        const updatedDevice = await existingDevice.save();
        if (!updatedDevice) {
            throw new Error(`Device with id '${deviceId}' could not be updated`);
        }

        mqttDeviceService.notify(updatedDevice.id, 'PATCH', devicePatch, 'Updated device');


        // Add device to newly associated room
        if (newRoom && !newRoom.deviceList.includes(updatedDevice.id)) {
            newRoom.deviceList.push(updatedDevice.id);
            await newRoom.save();
            mqttRoomService.notify(newRoom.id, null, null, `Added device with id '${updatedDevice.id}' to room`);
        }

        // Remove device from previously associated room
        if (previousRoom && previousRoom.deviceList.includes(updatedDevice.id)) {
            previousRoom.deviceList = previousRoom.deviceList.filter(d => d !== updatedDevice.id);
            await previousRoom.save();
            mqttRoomService.notify(previousRoom.id, null, null, `Removed device with id '${updatedDevice.id}' from room`);
        }

        return updatedDevice;
    }

    async deleteDevice(deviceId) {
        const device = await DeviceModel.findById(deviceId);
        if (!device) {
            throw new NotFoundError(`Device with id '${deviceId}' not found`);
        }

        let associatedRoom = null;
        if (device.roomId) {
            associatedRoom = await RoomModel.findById(device.roomId).exec();
        }

        // Delete device from database
        const deletedDevice = await DeviceModel.findByIdAndDelete(deviceId);
        if (!deletedDevice) {
            throw new Error(`Device with id '${deviceId}' could not be deleted`);
        }

        mqttDeviceService.notify(deviceId, 'DELETE', null, 'Deleted device');

        // Remove deviceId from the associated room's device list
        if (associatedRoom && associatedRoom.deviceList.includes(deviceId)) {
            associatedRoom.deviceList = associatedRoom.deviceList.filter(id => id !== deviceId);
            await associatedRoom.save();
            mqttRoomService.notify(associatedRoom.id, null, null, `Removed device with id '${deviceId}' from room`);
        }
    }
}