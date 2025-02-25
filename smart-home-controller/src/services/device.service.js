import logging from 'logging';

import { DevicePostModel, DevicePatchModel, DeviceModel } from "../model/device.model.js";

const logger = logging.default('device-service');

export async function findDevices() {
    try {
        const result = await DeviceModel.find();
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

export async function createDevice(input) {

    let device = new DevicePostModel(input);

    try {
        device = new DeviceModel(device);
        var result = await device.save();
        logger.info("Creating a device: ", result);
        return result;
    } catch (err) {
        logger.error("Error creating a device: ", err, '\n', device);
        throw err;
    }

}

export async function findDevice(id) {
    try {
        const result = await DeviceModel.findById(id);
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

export async function updateDevice(id, input) {

    const deviceUpdate = new DevicePatchModel(input, );

    logger.info("Updating a device: ", deviceUpdate);

    try {
        var result = await DeviceModel.findByIdAndUpdate(id, deviceUpdate, { new: true });
        logger.info("Updating a device: ", result);
        return result;
    }
    catch (err) {
        logger.error("Error updating a device: ", err, '\n', deviceUpdate);
        throw err;
    }
}

export async function deleteDevice(id) {
    try {
        const result = await DeviceModel.findByIdAndDelete(id);
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}