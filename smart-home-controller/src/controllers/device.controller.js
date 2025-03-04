import logging from "logging";

import { findDevices, createDevice, findDevice, updateDevice, deleteDevice } from "../services/device.service.js";
import { DevicePostModel, DevicePatchModel, DeviceId } from "../model/device.model.js";

const logger = logging.default("device-controller");

export async function getDevicesHandler(_req, res) {
    try {
        logger.info("GET /device");
        const devices = await findDevices();
        return res.status(200).json(devices);
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function createDeviceHandler(req, res) {
    try {
        const device = new DevicePostModel(req.body);
        logger.info("POST /device");

        await device.validate();

        var createdDevice = await createDevice(device);
        if (createdDevice === null) {
            throw new Error(`Device could not be created`);
        }

        return res.status(201).json(createdDevice);
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getDeviceHandler(req, res) {
    try {
        const deviceId = new DeviceId({ id: req.params.id });

        logger.info(`GET /device/${deviceId.id}`);

        await deviceId.validate();

        var device = await findDevice(deviceId.id);
        if (device === null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `Device with id '${deviceId.id}' not found`
                }
            });
        }

        return res.status(200).json(device);
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function updateDeviceHandler(req, res) {
    try {
        const deviceId = new DeviceId(req.params);
        const devicePatch = new DevicePatchModel(req.body);

        logger.info(`PATCH /device/${deviceId.id}`);

        await deviceId.validate();
        await devicePatch.validate();

        var updatedDevice = await updateDevice(deviceId.id, devicePatch);
        if (updatedDevice === null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `Device with id '${deviceId.id}' not found`
                }
            });
        }

        return res.status(200).json(updatedDevice);
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function deleteDeviceHandler(req, res) {
    try {
        const deviceId = new DeviceId({ id: req.params.id });

        logger.info(`DELETE /device/${deviceId.id}`);

        await deviceId.validate();

        var deletedDevice = await deleteDevice(deviceId.id);
        if (deletedDevice === null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: `Device with id '${deviceId.id}' not found`
                }
            });
        }

        return res.status(200).json("Device successfully deleted");
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
}
