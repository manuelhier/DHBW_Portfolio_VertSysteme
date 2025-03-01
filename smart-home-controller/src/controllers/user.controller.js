import logging from "logging";

import { findUsers, createUser, findUser, updateUser, deleteUser } from "../services/user.service.js";

const logger = logging.default("user-controller");

export function getUsersHandler(_req, res) {
    logger.info("GET /user");

    findUsers()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function createUsersHandler(_req, res) {
    logger.info("POST /user");

    createUser(_req.body)
        .then(savedUser => {
            res.status(201).json(savedUser);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function getUserHandler(req, res) {
    logger.info(`GET /user/${req.params.id}`);
    
    findUser(req.params.id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function updateUserHandler(req, res) {
    logger.info(`PATCH /user/${req.params.id}`);
    
    updateUser(req.params.id, req.body)
        .then(updatedUser => {
            res.status(200).json(updatedUser);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}

export function deleteUserHandler(req, res) {
    logger.info(`DELETE /user/${req.params.id}`);
    
    deleteUser(req.params.id)
        .then(() => {
            res.status(200);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
}