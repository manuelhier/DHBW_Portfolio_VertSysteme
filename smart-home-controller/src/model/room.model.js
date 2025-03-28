import mongoose from 'mongoose';
import { getEntityId } from './id.model.js';

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
 *         deviceList:
 *           type: array
 *           items:
 *             type: string
 *           description: List of device IDs associated with the room.
 *           example: ["device_1234", "device_5678"]
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
        // owner: { type: String, required: true },
        deviceList: { type: [String], default: [] }
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw",
        toJSON: {
            transform: function(_doc, ret) {
                return {
                    id: ret._id,
                    name: ret.name,
                    type: ret.type,
                    deviceList: ret.deviceList,
                    createdAt: ret.createdAt,
                    updatedAt: ret.updatedAt
                };
            }
        }
    }
);

/**
 * @openapi
 * components:
 *   requestBodies:
 *     RoomPost:
 *       type: object
 *       required:
 *         - name
 *         - type
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
 */
const roomPostSchema = new mongoose.Schema(
    {
        name: roomSchema.obj.name,
        type: roomSchema.obj.type,
        // owner: roomSchema.obj.owner,
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
 */
const roomPatchSchema = new mongoose.Schema(
    {
        name: { type: roomSchema.obj.name.type, required: false },
        type: { type: roomSchema.obj.type.type, required: false },
        // owner: { type: roomSchema.obj.owner.type, required: false },
        // deviceList: { type: roomSchema.obj.deviceList.type, required: false },
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw",
        autoCreate: false
    }
);

export const RoomId = mongoose.model("RoomId", roomId);
export const RoomModel = mongoose.model("Room", roomSchema);
export const RoomPostModel = mongoose.model("RoomPost", roomPostSchema);
export const RoomPatchModel = mongoose.model("RoomPatch", roomPatchSchema);