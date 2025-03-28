import logging from "logging";

import { UserId, UserPostModel, UserPatchModel } from "../model/user.model.js";
import { UserService } from "../services/user.service.js";

const logger = logging.default("user-controller");

const userService = new UserService();

export async function getUsersHandler(_req, res, next) {
    try {
        logger.info("GET /user");

        const users = await userService.getAllUsers();
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export async function createUsersHandler(req, res, next) {
    try {
        logger.info("POST /user");
        const userPost = new UserPostModel(req.body);

        await userService.validateEmail(userPost.email);
        await userService.validateAllowedRooms(userPost.allowedRooms);

        await userPost.validate();

        const createdUser = await userService.createUser(userPost);
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

        const user = await userService.getUserById(userId.id);
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

        const updatedUser = await userService.updateUser(userId.id, userPatch);
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

        await userService.deleteUser(userId.id);
        return res.status(200).send();
    } catch (error) {
        next(error)
    }
}