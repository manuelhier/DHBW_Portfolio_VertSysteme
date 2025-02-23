import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 4);

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
 *     DeviceInput:
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
 *     DeviceUpdate:
 *       type: object
 *       required:
 *         - name
 *         - manufacturer
 *         - type
 *         - status
 *         - roomId
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
const deviceInputSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        manufacturer: { type: String, required: true },
        type: {
            type: String,
            enum: [
                'lightswitch',
                'thermostat',
                'smart-lock',
                'window-shade',
                'window-sensor',
                'door-sensor',
            ],
            required: true
        }
    }
);

const deviceUpdateSchema = deviceInputSchema.add(
    {
        status: {
            type: String,
            enum: [
                'on',
                'off',
                'locked',
                'unlocked',
                'open',
                'closed',
            ],
            required: true,
            default: 'off'
        },
        roomId: { type: String, required: false }
    }
);

// const deviceSchema = deviceUpdateSchema.add(
//     {
//         id: {
//             type: String,
//             required: true,
//             unique: true,
//             default: () => `device_${nanoid()}`,
//         }
//     },
//     {
//         timestamps: true
//     }
// )

const DeviceInputModel = mongoose.model("DeviceInput", deviceInputSchema);
// const DeviceUpdateModel = mongoose.model("DeviceUpdate", deviceUpdateSchema);
// const DeviceModel = mongoose.model("Device", deviceSchema);

export default DeviceInputModel;