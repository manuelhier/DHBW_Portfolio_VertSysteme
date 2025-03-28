import { UserModel } from "../model/user.model.js";
import { RoomModel, RoomId } from "../model/room.model.js";
import { UserMqttService } from "../utils/mqtt.js";
import { BadRequestError, NotFoundError } from "../utils/apiErrors.js";

const mqttService = new UserMqttService();

export class UserService {

    async getAllUsers() {
        const users = await UserModel.find();
        mqttService.publishMqttMessage(`GET /user: ${JSON.stringify(users, null, '\t')}`);
        return users;
    }

    async createUser(userPost) {
        const createdUser = await UserModel.create(userPost);
        if (!createdUser) {
            throw new Error("User could not be created");
        }

        mqttService.publishMqttMessage(`Created user: ${JSON.stringify(createdUser, null, '\t')}`);
        return createdUser;
    }

    async getUserById(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new NotFoundError(`User with id '${userId}' not found`);
        }

        mqttService.publishMqttMessage(`GET /user/${userId}: ${JSON.stringify(user, null, '\t')}`);
        return user;
    }

    async updateUser(userId, userPatch) {
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            throw new NotFoundError(`User with id '${userId}' not found`);
        }

        if (userPatch.name && userPatch.name !== existingUser.name) {
            existingUser.name = userPatch.name;
        }

        if (userPatch.email && userPatch.email !== existingUser.email) {
            await this.validateEmail(userPatch.email);
            existingUser.email = userPatch.email;
        }

        if (userPatch.allowedRooms && userPatch.allowedRooms !== existingUser.allowedRooms) {
            await this.validateAllowedRooms(userPatch.allowedRooms);
            existingUser.allowedRooms = userPatch.allowedRooms;
        }

        existingUser.updatedAt = new Date();

        const updatedUser = await existingUser.save();
        if (!updatedUser) {
            throw new Error(`User with id '${userId}' could not be updated`);
        }

        mqttService.publishMqttMessage(`Updated user: ${JSON.stringify(updatedUser, null, '\t')}`);
        return updatedUser;
    }

    async deleteUser(userId) {
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new NotFoundError(`User with id '${userId}' not found`);
        }

        mqttService.publishMqttMessage(`Deleted user: ${JSON.stringify(deletedUser, null, '\t')}`);
    }

    // Validator helpers

    async validateEmail(email) {
        const emailOccurrence = await UserModel.find({ email }).exec();
        if (emailOccurrence.length !== 0) {
            throw new BadRequestError(`E-Mail '${email}' is already in use.`);
        }
    }

    async validateAllowedRooms(rooms) {
        if (rooms.length !== new Set(rooms).size) {
            throw new BadRequestError("No duplicated rooms allowed");
        }

        for (const room of rooms) {
            const roomId = new RoomId({ id: room });
            await roomId.validate();
            if (!(await RoomModel.findById(roomId.id).exec())) {
                throw new BadRequestError(`Room with id '${roomId.id}' does not exist.`);
            }
        }
    }
}