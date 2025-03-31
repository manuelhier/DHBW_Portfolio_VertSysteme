import logging from "logging";

import { UserId, UserPostModel, UserPatchModel } from "../model/user.model.js";
import { UserService, validateEmail, validateAllowedRooms } from "../services/user.service.js";

import { BadRequestError } from "../utils/apiErrors.js";

const logger = logging.default("user-controller");
const userService = new UserService();

export async function getUsersHandler(_req, res, next) {
    try {
        logger.info("GET /user");

        // Get all users
        const users = await userService.getAllUsers();
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export async function createUsersHandler(req, res, next) {
    try {
        logger.info("POST /user");

        // Create and validate the UserId
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError(`Body is required`);
        }

        // Check for valid keys in the request body
        let validKeys = ["name", "email", "allowedRooms"];
        for (const key in req.body) {
            if (!validKeys.includes(key)) {
                throw new BadRequestError(`Invalid field: ${key}`);
            }
        }

        // Create and validate the UserPostModel
        // Check if the email is valid
        // Check if the allowedRooms are valid
        const userPost = new UserPostModel(req.body);
        await Promise.all([
            validateEmail(userPost.email),
            validateAllowedRooms(userPost.allowedRooms),
            userPost.validate()
        ]).catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Create the user
        const createdUser = await userService.createUser(userPost);
        return res.status(201).json(createdUser);
    } catch (error) {
        next(error)
    }
}

export async function getUserHandler(req, res, next) {
    try {
        logger.info(`GET /user/${req.params.id}`);

        // Create and validate the UserId
        const userId = new UserId({ id: req.params.id });

        // Get the user
        const user = await userService.getUserById(userId.id);
        return res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export async function patchUserHandler(req, res, next) {
    try {
        logger.info(`PATCH /user/${req.params.id}`);

        // Create and validate the UserId
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError(`Body is required`);
        }

        // Check for valid keys in the request body
        let validKeys = ["name", "email", "allowedRooms"];
        for (const key in req.body) {
            if (!validKeys.includes(key)) {
                throw new BadRequestError(`Invalid field: ${key}`);
            }
        }

        // Create and validate the UserId and UserPatchModel
        const userId = new UserId({ id: req.params.id });
        const userPatch = new UserPatchModel(req.body);
        await Promise.all([
            userId.validate(),
            userPatch.validate()
        ]).catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Patch the user
        const updatedUser = await userService.patchUser(userId.id, userPatch);
        if (!updatedUser) {
            return res.status(204).send();
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error)
    }
}

export async function deleteUserHandler(req, res, next) {
    try {
        logger.info(`DELETE /user/${req.params.id}`);

        // Create and validate the UserId
        const userId = new UserId({ id: req.params.id });
        await userId.validate().catch((error) => {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        });

        // Delete the user
        await userService.deleteUser(userId.id);
        return res.status(200).send();
    } catch (error) {
        next(error)
    }
}