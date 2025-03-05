import logging from "logging";

import { DeviceId, DevicePostModel, DevicePatchModel } from "../model/device.model.js";
import { DeviceService } from "../utils/database.js";

const logger = logging.default("device-controller");
const deviceService = new DeviceService();

export async function getDevicesHandler(_req, res) {
    try {
        logger.info("GET /device");
        const devices = await deviceService.findAllDocuments();
        
        return res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}

export async function createDeviceHandler(req, res) {
    try {
        const device = new DevicePostModel(req.body);
        logger.info("POST /device");

        await device.validate();

        var createdDevice = await deviceService.createDocument(device);
        if (createdDevice === null) {
            throw new Error(`Device could not be created`);
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

        var device = await deviceService.findDocument(deviceId.id);
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

        var existingDevice = await deviceService.findDocument(deviceId.id);
        if (existingDevice === null) {
            throw new Error(`Device with id '${deviceId.id}' not found`);
        }

        if (devicePatch.name && devicePatch.name !== existingDevice.name) {
            existingDevice.name = devicePatch.name;
        }

        if (devicePatch.roomId && devicePatch.roomId !== existingDevice.roomId) {
            existingDevice.roomId = devicePatch.roomId;
        }

        if (devicePatch.status && devicePatch.status !== existingDevice.status) {
            if (!validateDeviceStatusForType(existingDevice.type, devicePatch.status)) {
                throw new Error(`Invalid status '${devicePatch.status}' for device type '${existingDevice.type}'`);
            } 
            existingDevice.status = devicePatch.status;
        }

        existingDevice.updatedAt = new Date();

        var updatedDevice = await deviceService.saveDocument(existingDevice);
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

        var deletedDevice = await deviceService.deleteDocument(deviceId.id);
        if (deletedDevice === null) {
            throw new Error(`Device with id '${deviceId.id}' not found`);
        }

        return res.status(200).json("Device successfully deleted");
    } catch (error) {
        next(error);
    }
}

const DEVICES = {
    "deviceStatusValidation": {
        "lightswitch": {
            "validStatuses": ["on", "off"],
            "defaultStatus": "off"
        },
        "thermostat": {
            "validStatuses": ["on", "off"],
            "defaultStatus": "off"
        },
        "smart-lock": {
            "validStatuses": ["locked", "unlocked"],
            "defaultStatus": "locked"
        },
        "window-shade": {
            "validStatuses": ["open", "closed"],
            "defaultStatus": "closed"
        },
        "window-sensor": {
            "validStatuses": ["open", "closed"],
            "defaultStatus": "closed"
        },
        "door-sensor": {
            "validStatuses": ["open", "closed"],
            "defaultStatus": "closed"
        }
    }
}

function validateDeviceStatusForType(deviceType, deviceStatus) {
    
    const type = DEVICES.deviceStatusValidation[deviceType];

    if (type === null) {
        return false;
    }

    if (!type.validStatuses.includes(deviceStatus)) {
        return false;
    }

    return true;
}
