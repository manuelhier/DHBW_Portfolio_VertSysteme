import mongoose from 'mongoose';
import nanoid from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 4);

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - role
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
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: password123
 *         role:
 *           type: string
 *           description: The role of the user.
 *           enum:
 *             - admin
 *             - user
 *             - child
 *             - guest
 *           example: user
 *         rooms:
 *           type: array
 *           items:
 *             type: string
 *           description: List of room IDs associated with the user.
 *           example: ["room_1234", "room_5678"]
 *         isHome:
 *           type: boolean
 *           description: Indicates if the user is currently at home.
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated.
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: password123
 *         role:
 *           type: string
 *           description: The role of the user.
 *           enum:
 *             - admin
 *             - user
 *             - child
 *             - guest
 *           example: user
 *         rooms:
 *           type: array
 *           items:
 *             type: string
 *           description: List of room IDs associated with the user.
 *           example: ["room_1234", "room_5678"]
 *         isHome:
 *           type: boolean
 *           description: Indicates if the user is currently at home.
 *           example: true
 */
const userSchma = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            default: () => `user_${nanoid()}`,
        },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: {
            type: String,
            enum: [
                'admin',
                'user',
                'child',
                'guest',
            ],
            required: true,
            default: 'user'
        },
        rooms: [String],
        isHome: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model("User", userSchma);

export default UserModel;
