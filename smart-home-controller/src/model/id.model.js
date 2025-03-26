import mongoose from "mongoose";
import { customAlphabet } from 'nanoid';
import { BadRequestError } from "../utils/apiErrors.js";

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 4);

export function getEntityId(entity) {
    return new mongoose.Schema(
        {
            id: {
                type: String,
                required: true,
                default: () => `${entity}_${nanoid()}`,
                validate: {
                    validator: (value) => validateEntityId(value, entity)
                }
            }
        }
    ); 
}

function validateEntityId(value, entity) {
    const errors = [];

    if (value === 'undefined') {
        errors.push(`ID is required.`);
    }

    if (value.length !== (entity.length + 5)) {
        errors.push(`ID must be ${entity.length + 5} characters long.`);
    }

    if (value.startsWith(`${entity}_`) === false) {
        errors.push(`ID must start with '${entity}_'.`);
    }

    if (errors.length > 0) {
        throw new BadRequestError(errors.join(' '));
    }
}
