import mongoose from 'mongoose';
import { getEntityId } from './id.model.js';

export const userId = new getEntityId("user");

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the user.
 *           example: user_ab12
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: john.doe@example.com
 *         allowedRooms:
 *           type: array
 *           items:
 *             type: string
 *           description: List of rooms the user is allowed to enter
 *           example: ["room_1234", "room_4321"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated.
 */
const userSchema = new mongoose.Schema(
    {
        _id: userId.obj.id,
        name: { type: String, required: true },
        email: { type: String, required: true },
        allowedRooms: { type: [String], default: [] }
    },
    {
        timestamps: true,
        versionKey: false,
        strict: true
    }
);

/**
 * @openapi
 * components:
 *   requestBodies:
 *     UserPost:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: john.doe@example.com
 *         allowedRooms:
 *           type: array
 *           items:
 *             type: string
 *           description: List of rooms the user is allowed to enter
 *           example: ["room_1234", "room_4321"]
 */
const userPostSchema = new mongoose.Schema(
    {
        name: userSchema.obj.name,
        email: userSchema.obj.email,
        allowedRooms: userSchema.obj.allowedRooms,
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw",
        autoCreate: false
    }
);

/**
 * @openapi
 * components:
 *   requestBodies:
 *     UserPatch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: john.doe@example.com
 *         allowedRooms:
 *           type: array
 *           items:
 *             type: string
 *           description: List of rooms the user is allowed to enter
 *           example: ["room_1234", "room_4321"]
 */
const userPatchSchema = new mongoose.Schema(
    {
        name: { type: userSchema.obj.name.type, required: false },
        email: { type: userSchema.obj.email.type, required: false },
        allowedRooms: { type: userSchema.obj.allowedRooms.type, required: false }
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw",
        autoCreate: false
    }
);


export const UserId = mongoose.model("UserId", userId);
export const UserModel = mongoose.model("User", userSchema);
export const UserPostModel = mongoose.model("UserPost", userPostSchema);
export const UserPatchModel = mongoose.model("UserPatch", userPatchSchema);
