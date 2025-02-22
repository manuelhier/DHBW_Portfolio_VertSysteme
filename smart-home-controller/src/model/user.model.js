import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchma = new Schema({
    id: {
        type: UUID,
        required: true,
        unique: true
    },
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: [
            'admin',
            'user',
            'child',
            'guest',
        ],
        required: true
    },
    rooms: [String],
    isHome: Boolean,
    createdAt: Date,
    updatedAt: Date
});
