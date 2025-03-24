import mongoose from 'mongoose';
import { getEntityId } from './id.model.js';
import { deviceId } from './device.model.js';
import { userId } from './user.model.js';

const ROOM_TYPES = [
    'living-room',
    'dining-room',
    'kitchen',
    'bedroom',
    'bathroom',
    'hallway',
    'basement',
    'attic',
    'garage',
    'backyard',
    'frontyard'
];

const ROOM_ROLES = [
    'admin',
    'user',
    'child',
    'guest'
];

const roomId = getEntityId("room");

/**
 * @openapi
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the room.
 *           example: room_ab12
 *         name:
 *           type: string
 *           description: The name of the room.
 *           example: Living Room
 *         type:
 *           type: string
 *           description: The type of the room.
 *           enum:
 *             - living-room
 *             - dining-room
 *             - kitchen
 *             - bedroom
 *             - bathroom
 *             - hallway
 *             - basement
 *             - attic
 *             - garage
 *             - backyard
 *             - frontyard
 *           example: living-room
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the room.
 *           example: user_ab12
 *         devices:
 *           type: array
 *           items:
 *             type: string
 *           description: List of device IDs associated with the room.
 *           example: ["device_1234", "device_5678"]
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: List of roles associated with the room.
 *           enum:
 *             - admin
 *             - user
 *             - child
 *             - guest
 *           example: ["user"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the room was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the room was last updated.
 */
const roomSchema = new mongoose.Schema(
    {
        _id: roomId.obj.id,
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ROOM_TYPES,
            required: true
        },
        owner: { type: String, required: true },
        devices: { type: [String], default: [] },
        roles: {
            type: [String],
            enum: ROOM_ROLES,
            required: true,
            default: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw"
    }
);

/**
 * @openapi
 * components:
 *   schemas:
 *     RoomPost:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - owner
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the room.
 *           example: Living Room
 *         type:
 *           type: string
 *           description: The type of the room.
 *           enum:
 *             - living-room
 *             - dining-room
 *             - kitchen
 *             - bedroom
 *             - bathroom
 *             - hallway
 *             - basement
 *             - attic
 *             - garage
 *             - backyard
 *             - frontyard
 *           example: living-room
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the room.
 *           example: user_ab12
 */
const roomPostSchema = new mongoose.Schema(
    {
        name: roomSchema.obj.name,
        type: roomSchema.obj.type,
        owner: roomSchema.obj.owner,
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw"
    }
);

/**
 * @openapi
 * components:
 *   schemas:
 *     RoomPatch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the room.
 *           example: Living Room
 *         type:
 *           type: string
 *           description: The type of the room.
 *           enum:
 *             - living-room
 *             - dining-room
 *             - kitchen
 *             - bedroom
 *             - bathroom
 *             - hallway
 *             - basement
 *             - attic
 *             - garage
 *             - backyard
 *             - frontyard
 *           example: living-room
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the room.
 *           example: user_ab12
 *         devices:
 *           type: array
 *           items:
 *             type: string
 *           description: List of device IDs associated with the room.
 *           example: ["device_1234", "device_5678"]
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: List of roles associated with the room.
 *           enum:
 *             - admin
 *             - user
 *             - child
 *             - guest
 *           example: ["user"]
 */
const roomPatchSchema = new mongoose.Schema(
    {
        name: { type: roomSchema.obj.name.type, required: false },
        // type: { type: roomSchema.obj.type.type, required: false },
        owner: { type: roomSchema.obj.owner.type, required: false },
        devices: { type: roomSchema.obj.devices.type, required: false },
        roles: { type: roomSchema.obj.roles.type, required: false }
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw"
    }
);

const roomDeviceSchema = new mongoose.Schema(
    {
        deviceId: deviceId.obj.id
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw"
    }
);

const roomUserSchema = new mongoose.Schema(
    {
        userId: userId.obj.id
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw"
    }
);

export const RoomId = mongoose.model("RoomId", roomId);
export const RoomModel = mongoose.model("Room", roomSchema);
export const RoomPostModel = mongoose.model("RoomPost", roomPostSchema);
export const RoomPatchModel = mongoose.model("RoomPatch", roomPatchSchema);

export const RoomDeviceModel = mongoose.model("RoomDevice", roomDeviceSchema);
export const RoomUserModel = mongoose.model("RoomUser", roomUserSchema);