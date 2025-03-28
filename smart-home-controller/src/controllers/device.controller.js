import logging from "logging";

import { DeviceId, DevicePostModel, DevicePatchModel } from "../model/device.model.js";
import { DeviceService } from "../services/device.service.js";

const logger = logging.default("device-controller");

const deviceService = new DeviceService();

export async function getDevicesHandler(_req, res, next) {
    try {
        logger.info("GET /device");

        const devices = await deviceService.getAllDevices();
        return res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}

export async function createDeviceHandler(req, res, next) {
    try {
        logger.info("POST /device");

        const devicePost = new DevicePostModel(req.body);

        const createdDevice = await deviceService.createDevice(devicePost)
        return res.status(201).json(createdDevice);
    } catch (error) {
        next(error);
    }
}

export async function getDeviceHandler(req, res, next) {
    try {
        logger.info(`GET /device/${req.params.id}`);

        const deviceId = new DeviceId({ id: req.params.id });
        await deviceId.validate();

        const device = await deviceService.getDeviceById(deviceId.id);
        return res.status(200).json(device);
    } catch (error) {
        next(error);
    }
}

export async function updateDeviceHandler(req, res, next) {
    try {
        logger.info(`PATCH /device/${req.params.id}`);

        const deviceId = new DeviceId({ id: req.params.id });
        await deviceId.validate();

        const devicePatch = new DevicePatchModel(req.body);
        await devicePatch.validate();

        const updatedDevice = await deviceService.updateDevice(deviceId.id, devicePatch);
        return res.status(200).json(updatedDevice);
    } catch (error) {
        next(error);
    }
}

export async function deleteDeviceHandler(req, res, next) {
    try {
        logger.info(`DELETE /device/${req.params.id}`);

        const deviceId = new DeviceId({ id: req.params.id });
        await deviceId.validate();

        await deviceService.deleteDevice(deviceId.id);
        return res.status(200).send();
    } catch (error) {
        next(error);
    }
}