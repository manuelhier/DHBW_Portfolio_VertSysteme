import logging from "logging";
import { findDevices, createDevice, findDevice, updateDevice, deleteDevice } from "../services/device.service.js";

import { DevicePatchModel, DeviceId } from "../model/device.model.js";

const logger = logging.default("device-controller");

export function getDevicesHandler(_req, res) {
    logger.info("GET /device");

    findDevices()
        .then(devices => {
            res.status(200).json(devices);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function createDeviceHandler(req, res) {
    logger.info("POST /device");

    createDevice(req.body)
        .then(savedDevice => {
            res.status(201).json(savedDevice);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
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
        const device = new DevicePatchModel(req.body);

        logger.info(`PATCH /device/${deviceId.id}`);

        // Validiere die Eingabe
        await deviceId.validate();
        await device.validate();

        // Warte auf das Update und stoppe bei Fehlern
        var updatedDevice = await updateDevice(deviceId.id, device);
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
