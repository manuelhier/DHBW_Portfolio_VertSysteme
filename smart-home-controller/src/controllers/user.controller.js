import logging from "logging";

import { UserId, UserModel, UserPostModel, UserPatchModel } from "../model/user.model.js";
import { UserDatabaseService } from "../utils/database.js";
import { UserMqttService } from "../utils/mqtt.js";

import { RoomModel, RoomId } from "../model/room.model.js";
import { BadRequestError, NotFoundError } from "../utils/apiErrors.js";

const logger = logging.default("user-controller");
const databaseService = new UserDatabaseService();
const mqttService = new UserMqttService();

export async function getUsersHandler(_req, res, next) {
    try {
        logger.info("GET /user");
        const users = await databaseService.findAllDocuments();

        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export async function createUsersHandler(req, res, next) {
    try {
        logger.info("POST /user");
        const user = UserPostModel(req.body);

        // Check if email is already used
        await validateEMail(user.email);

        // for (var roomId of user.rooms) {
        //     if (await RoomModel.findById(roomId).exec() === null) {
        //         throw new BadRequestError(`Room '${roomId}' does not exist.`);
        //     }
        // }

        // Check if rooms exist
        await validateRooms(user.rooms);

        var createdUser = await databaseService.createDocument(user);
        if (createdUser == null) {
            throw new Error('User could not be created')
        }

        mqttService.publishMqttMessage(`Created user : ` + JSON.stringify(createdUser))

        return res.status(201).json(createdUser);
    } catch (error) {
        next(error)
    }
}

export async function getUserHandler(req, res, next) {

    try {
        logger.info(`GET /user/${req.params.id}`);
        const userId = new UserId({ id: req.params.id });

        await userId.validate();

        var user = await databaseService.findDocument(userId.id);
        if (user === null) {
            throw new NotFoundError(`User with id '${userId.id}' not found`)
        }

        return res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export async function updateUserHandler(req, res, next) {
    try {
        logger.info(`PATCH /user/${req.params.id}`);

        const userId = new UserId({ id: req.params.id });
        const userPatch = new UserPatchModel(req.body);

        await userId.validate();

        var existingUser = await databaseService.findDocument(userId.id);
        if (existingUser === null) {
            throw new NotFoundError(`User with id '${userId.id}' not found`)
        }

        if (userPatch.name && userPatch.name !== existingUser.name) {
            existingUser.name = userPatch.name;
        }

        if (userPatch.email && userPatch.email !== existingUser.email) {
            // Check if email is already used
            await validateEMail(userPatch.email);

            existingUser.email = userPatch.email;
        }

        if (userPatch.rooms && userPatch.rooms !== existingUser.rooms) {
            // Check if rooms exist
            await validateRooms(userPatch.rooms);

            existingUser.rooms = userPatch.rooms;
        }

        existingUser.updatedAt = new Date();

        logger.info(`Updated user : ` + JSON.stringify(existingUser));

        var updatedUser = await databaseService.saveDocument(existingUser);
        if (updatedUser === null) {
            throw new Error(`Room with id '${userId.id}' could not be updated`);
        }

        mqttService.publishMqttMessage(`Updated room : ` + JSON.stringify(updatedUser));

        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error)
    }
}

export async function deleteUserHandler(req, res, next) {

    try {
        logger.info(`DELETE /user/${req.params.id}`);

        const userId = new UserId({ id : req.params.id});
        await userId.validate();

        var deletedUser = await databaseService.deleteDocument(userId.id)
        if (deletedUser === null) {
            throw new NotFoundError(`User with id '${userId.id}' not found`)
        }

        mqttService.publishMqttMessage(`Deleted user : ` + JSON.stringify(deletedUser));

        return res.status(200).json("User successfully deleted");
    } catch (error) {
        next(error)
    }
}

// Validation helpers

async function validateEMail(email) {
    var emailOccurance = await UserModel.find({ email: email }).exec()

    if (emailOccurance.length !== 0) {
        throw new BadRequestError(`E-Mail '${email}' is already in use.`)
    }
}

async function validateRooms(rooms) {
    if (rooms.length !== new Set(rooms).size) {
        throw new BadRequestError('No duplicated rooms allowed')
    }

    for (var roomId of rooms) {
        roomId = new RoomId({ id: roomId });
        await roomId.validate();
        if (await RoomModel.findById(roomId.id).exec() === null) {
            throw new BadRequestError(`Room '${roomId.id}' does not exist.`);
        }
    }
}