import logging from "logging";

import { DeviceId, DevicePostModel, DevicePatchModel } from "../model/device.model.js";
import { DeviceService } from "../services/device.service.js";

import { BadRequestError } from "../utils/apiErrors.js";

const logger = logging.default("device-controller");
const deviceService = new DeviceService();


export async function getDevicesHandler(_req, res, next) {
    try {
        logger.info("GET /device");

        // Get all devices
        const devices = await deviceService.getAllDevices();
        return res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}

export async function createDeviceHandler(req, res, next) {
    try {
        logger.info("POST /device");

        // Validate the request body
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError(`Body is required`);
        }

        // Check for valid keys in the request body
        let validKeys = ["name", "manufacturer", "type", "roomId"];
        for (const key in req.body) {
            if (!validKeys.includes(key)) {
                throw new BadRequestError(`Invalid field: ${key}`);
            }
        }

        // Create and validate the DevicePostModel
        const devicePost = new DevicePostModel(req.body);
        await devicePost.validate().catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Create the device
        const createdDevice = await deviceService.createDevice(devicePost)
        return res.status(201).json(createdDevice);
    } catch (error) {
        next(error);
    }
}

export async function getDeviceHandler(req, res, next) {
    try {
        logger.info(`GET /device/${req.params.id}`);

        // Create and validate the DeviceId
        const deviceId = new DeviceId({ id: req.params.id });
        await deviceId.validate().catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Get the device
        const device = await deviceService.getDeviceById(deviceId.id);
        return res.status(200).json(device);
    } catch (error) {
        next(error);
    }
}

export async function patchDeviceHandler(req, res, next) {
    try {
        logger.info(`PATCH /device/${req.params.id}`);

        // Validate the request body
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError(`Body is required`);
        }

        // Check for valid keys in the request body
        let validKeys = ["name", "status", "roomId"];
        for (const key in req.body) {
            if (!validKeys.includes(key)) {
                throw new BadRequestError(`Invalid field: ${key}`);
            }
        }

        // Create and validate the DeviceId and DevicePatchModel
        const deviceId = new DeviceId({ id: req.params.id });
        const devicePatch = new DevicePatchModel(req.body);
        await Promise.all([
            deviceId.validate(),
            devicePatch.validate()
        ]).catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Patch the device
        const updatedDevice = await deviceService.patchDevice(deviceId.id, devicePatch);
        return res.status(200).json(updatedDevice);
    } catch (error) {
        next(error);
    }
}

export async function deleteDeviceHandler(req, res, next) {
    try {
        logger.info(`DELETE /device/${req.params.id}`);

        // Create and validate the DeviceId
        const deviceId = new DeviceId({ id: req.params.id });
        await deviceId.validate().catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Delete the device
        await deviceService.deleteDevice(deviceId.id);
        return res.status(200).send();
    } catch (error) {
        next(error);
    }
}