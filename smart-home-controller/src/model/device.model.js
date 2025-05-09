import mongoose from 'mongoose';
import { getEntityId } from './id.model.js';

const DEVICE_TYPES = [
    'lightswitch',
    'thermostat',
    'smart-lock',
    'window-shade',
    'window-sensor',
    'door-sensor',
];

const DEVICE_STATUS = [
    'on',
    'off',
    'locked',
    'unlocked',
    'open',
    'closed',
];

export const deviceId = getEntityId("device");

/**
 * @openapi
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the device.
 *           example: device_ab12
 *         name:
 *           type: string
 *           description: The name of the device.
 *           example: Living Room Light
 *         manufacturer:
 *           type: string
 *           description: The manufacturer of the device.
 *           example: Philips
 *         type:
 *           type: string
 *           description: The type of the device.
 *           enum:
 *             - lightswitch
 *             - thermostat
 *             - smart-lock
 *             - window-shade
 *             - window-sensor
 *             - door-sensor
 *           example: lightswitch
 *         status:
 *           type: string
 *           description: The current status of the device.
 *           enum:
 *             - on
 *             - off
 *             - locked
 *             - unlocked
 *             - open
 *             - closed
 *           example: off
 *         roomId:
 *           type: string
 *           description: The ID of the room where the device is located.
 *           example: room_1234
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the device was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the device was last updated.
 */
const deviceSchema = new mongoose.Schema(
    {
        _id: deviceId.obj.id,
        name: { 
            type: String, 
            required: [true, "Device name is required"] 
        },
        manufacturer: { 
            type: String, 
            required: [true, "Device manufacturer is required"], 
        },
        type: {
            type: String,
            enum: DEVICE_TYPES,
            required: [true , "Device type is required"],
        },
        status: {
            type: String,
            enum: DEVICE_STATUS,
            default: null
        },
        roomId: { 
            type: String, 
            default: null 
        }
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
                    manufacturer: ret.manufacturer,
                    type: ret.type,
                    status: ret.status,
                    roomId: ret.roomId,
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
 *     DevicePost:
 *       type: object
 *       required:
 *         - name
 *         - manufacturer
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the device.
 *           example: Living Room Light
 *         manufacturer:
 *           type: string
 *           description: The manufacturer of the device.
 *           example: Philips
 *         type:
 *           type: string
 *           description: The type of the device.
 *           enum:
 *             - lightswitch
 *             - thermostat
 *             - smart-lock
 *             - window-shade
 *             - window-sensor
 *             - door-sensor
 *           example: lightswitch
 *         roomId:
 *           type: string
 *           description: The ID of the room where the device is located.
 *           example: room_1234
 */
const devicePostSchema = new mongoose.Schema(
    {
        name: deviceSchema.obj.name,
        manufacturer: deviceSchema.obj.manufacturer,
        type: deviceSchema.obj.type,
        roomId: deviceSchema.obj.roomId
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
 *  requestBodies:
 *    DevicePatch:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: The name of the device.
 *          example: Living Room Light
 *        status:
 *          type: string
 *          description: The current status of the device.
 *          enum:
 *            - on
 *            - off
 *            - locked
 *            - unlocked
 *            - open
 *            - closed
 *          example: off
 *        roomId:
 *          type: string
 *          description: The ID of the room where the device is located.
 *          example: room_1234
 */
const devicePatchSchema = new mongoose.Schema(
    {
        name: { type: deviceSchema.obj.name.type, required: false },
        status: { type: deviceSchema.obj.status.type, required: false },
        roomId: { type: deviceSchema.obj.roomId.type, required: false }
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw",
        autoCreate: false
    }
);

const DeviceId = mongoose.model("DeviceId", deviceId);
const DeviceModel = mongoose.model("Device", deviceSchema);
const DevicePostModel = mongoose.model("DeviceInput", devicePostSchema);
const DevicePatchModel = mongoose.model("DeviceUpdate", devicePatchSchema);

export { DevicePostModel, DevicePatchModel, DeviceModel, DeviceId };