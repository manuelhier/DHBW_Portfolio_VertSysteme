import mongoose from 'mongoose';
import nanoid from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 4);

/**
 * @openapi
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - type
 *         - owner
 *         - roles
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
 *     RoomInput:
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

const roomSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            default: () => `room_${nanoid()}`,
        },
        name: { type: String, required: true },
        type: {
            type: String,
            enum: [
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
                'frontyard',
            ],
            required: true
        },
        owner: { type: String, required: true },
        devices: { type: [String], default: [] },
        roles: {
            type: [String],
            enum: [
                'admin',
                'user',
                'child',
                'guest',
            ],
            required: true,
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

const RoomModel = mongoose.model("Room", roomSchema);

export default RoomModel;