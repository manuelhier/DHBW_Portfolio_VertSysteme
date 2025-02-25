import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 4);

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

/**
 * @openapi
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - manufacturer
 *         - type
 *         - status
 *         - roomId
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
 *     DevicePatch:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - status
 *         - roomId
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the device.
 *           example: Living Room Light
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
 */
const deviceSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => `device_${nanoid()}`,
        },
        name: { type: String, required: true },
        manufacturer: { type: String, required: true },
        type: {
            type: String,
            enum: DEVICE_TYPES,
            required: true
        },
        status: {
            type: String,
            enum: DEVICE_STATUS,
            default: 'off'
        },
        roomId: { type: String, default: null }
    },
    {
        timestamps: true,
        strict: "throw"
    }
);

const devicePostSchema = new mongoose.Schema(
    {
        _id: false,
        name: deviceSchema.obj.name,
        manufacturer: deviceSchema.obj.manufacturer,
        type: deviceSchema.obj.type
    },
    {
        strict: "throw"
    }
);

const devicePatchSchema = new mongoose.Schema(
    {
        _id: false,
        name: deviceSchema.obj.name,
        status: deviceSchema.obj.status,
        roomId: deviceSchema.obj.roomId
    },
    {
        strict: "throw"
    }
);

const DevicePostModel = mongoose.model("DeviceInput", devicePostSchema);
const DevicePatchModel = mongoose.model("DeviceUpdate", devicePatchSchema);
const DeviceModel = mongoose.model("Device", deviceSchema);

export { DevicePostModel, DevicePatchModel, DeviceModel };