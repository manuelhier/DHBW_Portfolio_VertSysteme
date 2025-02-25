import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 4);

const USER_ROLES = [
    'admin',
    'user',
    'child',
    'guest'
]

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
 *     UserPost:
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
const userSchema = new mongoose.Schema(
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
            enum: USER_ROLES,
            required: true,
            default: 'user'
        },
        rooms: [String],
        isHome: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        strict: true,
    }
);

const userPostSchema = new mongoose.Schema(
    {
        _id: false,
        name: userSchema.obj.name,
        email: userSchema.obj.email,
        password: userSchema.obj.password,    
    },
    {
        strict: "throw",
    }
);

const userPatchSchema = new mongoose.Schema(
    {
        _id: false,
        name: userSchema.obj.name,
        email: userSchema.obj.email,
        password: userSchema.obj.password,
        role: userSchema.obj.role,
        rooms: userSchema.obj.rooms,
        isHome: userSchema.obj.isHome,
    },
    {
        strict: "throw",
    }
);

const UserModel = mongoose.model("User", userSchema);
const UserPostModel = mongoose.model("UserPost", userPostSchema);
const UserPatchModel = mongoose.model("UserPatch", userPatchSchema);

export default { UserPostModel, UserPatchModel, UserModel };