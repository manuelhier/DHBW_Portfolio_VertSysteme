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
 */
const userPostSchema = new mongoose.Schema(
    {
        name: userSchema.obj.name,
        email: userSchema.obj.email,
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
 *         isHome:
 *           type: boolean
 *           description: Indicates if the user is currently at home.
 *           example: true
 */
const userPatchSchema = new mongoose.Schema(
    {
        name: { type: userSchema.obj.name.type, required: false },
        email: { type: userSchema.obj.email.type, required: false },
        isHome: { type: userSchema.obj.isHome.type, required: false }
    },
    {
        _id: false,
        versionKey: false,
        strict: "throw",
    }
);


export const UserId = mongoose.model("UserId", userId);
export const UserModel = mongoose.model("User", userSchema);
export const UserPostModel = mongoose.model("UserPost", userPostSchema);
export const UserPatchModel = mongoose.model("UserPatch", userPatchSchema);
