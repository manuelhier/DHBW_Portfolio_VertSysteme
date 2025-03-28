import logging from "logging";

import { DeviceId, DevicePostModel, DevicePatchModel } from "../model/device.model.js";
import { DeviceDatabaseService } from "../utils/database.js";
import { DeviceMqttService, RoomMqttService } from "../utils/mqtt.js";

import { RoomModel } from "../model/room.model.js";
import { BadRequestError } from "../utils/apiErrors.js";

const logger = logging.default("device-controller");
const databaseService = new DeviceDatabaseService();
const mqttDeviceService = new DeviceMqttService();
const mqttRoomService = new RoomMqttService();

export async function getDevicesHandler(_req, res, next) {
    try {
        logger.info("GET /device");
        const devices = await databaseService.findAllDocuments();

        return res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}

export async function createDeviceHandler(req, res, next) {
    try {
        const device = new DevicePostModel(req.body);
        logger.info("POST /device");

        // Check if type is of supported
        const supportedTypes = Object.keys(ALLOWED_DEVICES_AND_STATES);
        if (device.type) {
            if (!supportedTypes.includes(device.type)) {
                throw new BadRequestError(`Type '${device.type}' not supprted. Supported types: ${supportedTypes.join(", ")}`);
            }
        } else {
            throw new BadRequestError(`A supported type must be specified. Supported types: ${supportedTypes.join(", ")}`);
        }

        // Check if room exists
        var associatedRoom = null;
        if (device.roomId) {
            associatedRoom = await RoomModel.findById(device.roomId).exec();
            if (associatedRoom === null) {
                throw new BadRequestError(`Room '${device.roomId}' does not exist.`);
            }
        }

        await device.validate();

        var createdDevice = await databaseService.createDocument(device);
        if (createdDevice === null) {
            throw new Error(`Device could not be created`);
        }

        mqttDeviceService.publishMqttMessage(`Created device : ` + createdDevice);

        // Add device to newly associated room
        if (associatedRoom && associatedRoom.deviceList && !associatedRoom.deviceList.includes(createdDevice.id)) {
            associatedRoom.deviceList.push(createdDevice.id);
            await associatedRoom.save();

            mqttRoomService.publishMqttMessage(`Updated room : ` + associatedRoom)
        }

        return res.status(201).json(createdDevice);
    } catch (error) {
        next(error);
    }
}

export async function getDeviceHandler(req, res, next) {
    try {
        const deviceId = new DeviceId({ id: req.params.id });

        logger.info(`GET /device/${deviceId.id}`);

        await deviceId.validate();

        var device = await databaseService.findDocument(deviceId.id);
        if (device === null) {
            throw new Error(`Device with id '${deviceId.id}' not found`);
        }

        return res.status(200).json(device);
    } catch (error) {
        next(error);
    }
}

export async function updateDeviceHandler(req, res, next) {
    try {
        const deviceId = new DeviceId(req.params);
        const devicePatch = new DevicePatchModel(req.body);

        logger.info(`PATCH /device/${deviceId.id}`);

        await deviceId.validate();
        await devicePatch.validate();

        var existingDevice = await databaseService.findDocument(deviceId.id);
        if (existingDevice === null) {
            throw new Error(`Device with id '${deviceId.id}' not found`);
        }

        if (devicePatch.name && devicePatch.name !== existingDevice.name) {
            existingDevice.name = devicePatch.name;
        }

        var newRoom, previousRoom = null;

        // Check if roomId was changed
        if (devicePatch.roomId && devicePatch.roomId !== existingDevice.roomId) {
            // Get new room by id
            newRoom = await RoomModel.findById(devicePatch.roomId).exec();

            // Check if new room exists
            if (newRoom === null) {
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
        var updatedDevice = await databaseService.saveDocument(existingDevice);
        if (updatedDevice === null) {
            throw new Error(`Device with id '${deviceId.id}' could not be updated`);
        }

        mqttDeviceService.publishMqttMessage(`Updated device : ` + updatedDevice);


        // Add device to newly associated room
        if (newRoom && !newRoom.deviceList.includes(updatedDevice.id)) {
            newRoom.deviceList.push(updatedDevice.id);
            await newRoom.save();

            mqttRoomService.publishMqttMessage(`Updated room : ` + newRoom)
        }

        // Remove device from previously associated room
        if (previousRoom && previousRoom.deviceList.includes(updatedDevice.id)) {
            previousRoom.deviceList = previousRoom.deviceList.filter(d => d !== updatedDevice.id);
            await previousRoom.save();

            mqttRoomService.publishMqttMessage(`Updated room : ` + previousRoom)
        }

        return res.status(200).json(updatedDevice);
    } catch (error) {
        next(error);
    }
}

export async function deleteDeviceHandler(req, res, next) {
    try {
        const deviceId = new DeviceId({ id: req.params.id });

        logger.info(`DELETE /device/${deviceId.id}`);

        await deviceId.validate();

        var associatedRoom = null;
        var device = await databaseService.findDocument(deviceId.id)
        if (device.roomId !== null) {
            associatedRoom = await RoomModel.findById(device.roomId).exec();
        }

        var deletedDevice = await databaseService.deleteDocument(deviceId.id);
        if (deletedDevice === null) {
            throw new Error(`Device with id '${deviceId.id}' not found`);
        }

        mqttDeviceService.publishMqttMessage(`Deleted device : ` + JSON.stringify(deletedDevice.id));

        // Remove deviceId from the associated room's device list
        if (associatedRoom !== null && associatedRoom.deviceList && associatedRoom.deviceList.includes(deviceId.id)) {
            associatedRoom.deviceList = associatedRoom.deviceList.filter(id => id !== deviceId.id);
            await associatedRoom.save();

            mqttRoomService.publishMqttMessage(`Updated room : \n` + associatedRoom);
        }

        return res.status(200).send();
    } catch (error) {
        next(error);
    }
}

const ALLOWED_DEVICES_AND_STATES = {
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
}

function validateDeviceStatus(deviceType, deviceStatus) {
    const type = ALLOWED_DEVICES_AND_STATES[deviceType];

    if (!type || !type.allowedStates.includes(deviceStatus)) {
        throw new BadRequestError(`Invalid status '${deviceStatus}' for device type '${deviceType}'. Valid status: ${type.allowedStates.join(' / ')}.`);
    }
}
