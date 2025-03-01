import logging from "logging";

const logger = logging.default("user-controller");

export function getUser(_req, res) {
    logger.info("Getting all users");
    res.send("Getting all users");
}

export function createUser(_req, res) {
    logger.info("Creating a user");
    res.send("Creating a user");
}

export function getUserById(req, res) {
    logger.info(`GET /user/${req.params.id}`);
    res.send(`GET /user/${req.params.id}`);
}

export function updateUserById(req, res) {
    logger.info(`PATCH /user/${req.params.id}`);
    res.send(`PATCH /user/${req.params.id}`);
}

export function deleteUserById(req, res) {
    logger.info(`DELETE /user/${req.params.id}`);
    res.send(`DELETE /user/${req.params.id}`);
}

export default { getUser, createUser, getUserById, updateUserById, deleteUserById };
