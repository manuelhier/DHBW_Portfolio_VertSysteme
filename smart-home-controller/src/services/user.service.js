import { UserModel } from "../model/user.model.js";
import { RoomModel, RoomId } from "../model/room.model.js";
import { UserMqttService } from "../utils/mqtt.js";
import { BadRequestError, NotFoundError } from "../utils/apiErrors.js";

const mqttService = new UserMqttService();

export async function validateEmail(email) {
    const emailOccurrence = await UserModel.find({ email }).exec();
    if (emailOccurrence.length !== 0) {
        throw new BadRequestError(`E-Mail '${email}' is already in use.`);
    }
}

export async function validateAllowedRooms(rooms) {
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

export class UserService {

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async createUser(userPost) {
        const createdUser = await UserModel.create(userPost);
        if (!createdUser) {
            throw new Error("User could not be created");
        }

        mqttService.notify(createdUser.id, 'POST', userPost, 'Created a new user'); 
        return createdUser;
    }

    async getUserById(userId) {
        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new NotFoundError(`User with id '${userId}' not found`);
        }

        return user;
    }

    async patchUser(userId, userPatch) {
        // Check if existing user exists
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            throw new NotFoundError(`User with id '${userId}' not found`);
        }

        let isUpdated = false;

        // Update the name if provided and different from the existing one
        if (userPatch.name && userPatch.name !== existingUser.name) {
            existingUser.name = userPatch.name;
            isUpdated = true;
        }

        // Update the email if provided and different from the existing one
        if (userPatch.email && userPatch.email !== existingUser.email) {
            await validateEmail(userPatch.email);
            existingUser.email = userPatch.email;
            isUpdated = true;
        }

        // Update the password if provided and different from the existing one
        if (userPatch.allowedRooms && userPatch.allowedRooms !== existingUser.allowedRooms) {
            await validateAllowedRooms(userPatch.allowedRooms);
            existingUser.allowedRooms = userPatch.allowedRooms;
            isUpdated = true;
        }

        // Check if any updates were made
        // If there are updates, update the updatedAt field
        // If no updates were made, notify and return false
        if (isUpdated) {
            existingUser.updatedAt = new Date();
        } else {
            // Nothing changed
            mqttService.notify(userId, 'PATCH', null, 'No changes made to user');
            return false;
        }

        // Save the updated user to the database
        const updatedUser = await existingUser.save();
        if (!updatedUser) {
            throw new Error(`User with id '${userId}' could not be updated`);
        }

        mqttService.notify(userId, 'PATCH', userPatch, 'Updated user');
        return updatedUser;
    }

    async deleteUser(userId) {
        // Delete the user from the database
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new NotFoundError(`User with id '${userId}' not found`);
        }

        mqttService.notify(userId, 'DELETE', null, 'Deleted user');
    }
}