import logging from 'logging';

import { UserPostModel, UserPatchModel, UserModel } from "../model/user.model.js";

const logger = logging.default('user-service');

export async function findUsers() {
    try {
        const result = await UserModel.find();
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

export async function createUser(input) {

    let user = new UserPostModel(input);

    try {
        user = new UserModel(user);
        var result = await user.save();
        logger.info("Creating a user: ", result);
        return result;
    } catch (err) {
        logger.error("Error creating a user: ", err, '\n', user);
        throw err;
    }

}

export async function findUser(id) {
    try {
        const result = await UserModel.findById(id);
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

export async function updateUser(id, input) {

    const userUpdate = new UserPatchModel(input, );

    logger.info("Updating a user: ", userUpdate);

    try {
        var result = await UserModel.findByIdAndUpdate(id, userUpdate, { new: true });
        logger.info("Updating a user: ", result);
        return result;
    }
    catch (err) {
        logger.error("Error updating a user: ", err, '\n', userUpdate);
        throw err;
    }
}

export async function deleteUser(id) {
    try {
        const result = await UserModel.findByIdAndDelete(id);
        return result;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}