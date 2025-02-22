import mongoose from 'mongoose';
const { Schema } = mongoose;

const deviceSchema = new Schema({
    id: {
        type: UUID,
        required: true,
        unique: true
    },
    name: String,
    manufacturer: String,
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
    },
    status: Boolean,
    roomId: String,
    createdAt: Date,
    updatedAt: Date
});