import mongoose from 'mongoose';
import { getEntityId } from './id.model.js';

const USER_ROLES = [
    'admin',
    'user',
    'child',
    'guest'
]

const userId = new getEntityId("user");

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
 */
const userSchema = new mongoose.Schema(
    {
        _id: userId.obj.id,
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: {
            type: String,
            enum: USER_ROLES,
            required: true,
            default: 'user'
        },
        isHome: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
        strict: true,
    }
);

/**
 * @openapi
 * components:
 *   schemas:
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
 */
const userPostSchema = new mongoose.Schema(
    {
        name: userSchema.obj.name,
        email: userSchema.obj.email,
        password: userSchema.obj.password,
        role: userSchema.obj.role
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw",
    }
);

/**
 * @openapi
 * components:
 *   schemas:
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
 *         isHome:
 *           type: boolean
 *           description: Indicates if the user is currently at home.
 *           example: true
 */
const userPatchSchema = new mongoose.Schema(
    {
        name: { type: userSchema.obj.name.type, required: false },
        email: { type: userSchema.obj.email.type, required: false },
        password: { type: userSchema.obj.password.type, required: false },
        role: { type: userSchema.obj.role.type, required: false },
        isHome: { type: userSchema.obj.isHome.type, required: false }
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw",
    }
);

const UserId = mongoose.model("UserId", userId);
const UserModel = mongoose.model("User", userSchema);
const UserPostModel = mongoose.model("UserPost", userPostSchema);
const UserPatchModel = mongoose.model("UserPatch", userPatchSchema);

export { UserPostModel, UserPatchModel, UserModel, UserId };