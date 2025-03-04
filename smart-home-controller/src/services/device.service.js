import logging from 'logging';

import { DeviceModel } from "../model/device.model.js";

const logger = logging.default('device-service');

export async function findDevices() {
    return await DeviceModel.find().catch(err => {
        logger.error("Error finding devices: ", err);
        throw err;
    });
}

export async function createDevice(post) {
    return new DeviceModel(post).save().catch(err => {
        logger.error("Error creating a device: ", err, '\n', post);
        throw err;
    });
}

export async function findDevice(id) {
    return await DeviceModel.findById(id).catch(err => {
        logger.error("Error finding a device: ", err);
        throw err;
    });
}

export async function updateDevice(id, patch) {
    return await DeviceModel.findByIdAndUpdate(id, patch, { new: true }).catch(err => {
        logger.error("Error updating a device: ", err, '\n', patch);
        throw err;
    });
}

export async function deleteDevice(id) {
    return await DeviceModel.findByIdAndDelete(id).catch(err => {
        logger.error("Error deleting a device: ", err);
        throw err;
    });
}