import mongoose from 'mongoose';
const { Schema } = mongoose;

const roomSchema = new Schema({
    id: {
        type: UUID,
        required: true,
        unique: true
    },
    name: String,
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
    owner: String,
    devices: [String],
    roles: [String],
    createdAt: Date,
    updatedAt: Date
});