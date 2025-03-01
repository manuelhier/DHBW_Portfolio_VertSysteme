import logging from "logging";

const logger = logging.default("user-controller");

export function getUsersHandler(_req, res) {
    logger.info("Getting all users");
    res.send("Getting all users");
}

export function createUsersHandler(_req, res) {
    logger.info("Creating a user");
    res.send("Creating a user");
}

export function getUserHandler(req, res) {
    logger.info(`GET /user/${req.params.id}`);
    res.send(`GET /user/${req.params.id}`);
}

export function updateUserHandler(req, res) {
    logger.info(`PATCH /user/${req.params.id}`);
    res.send(`PATCH /user/${req.params.id}`);
}

export function deleteUserHandler(req, res) {
    logger.info(`DELETE /user/${req.params.id}`);
    res.send(`DELETE /user/${req.params.id}`);
}