import mongoose from 'mongoose';
import logging from 'logging';

import { DeviceModel } from '../model/device.model.js';
import { RoomModel } from '../model/room.model.js';
import { UserModel } from '../model/user.model.js';

const logger = logging.default('database-service');

export default async function connectToDatabase() {
    const mongoURI = "mongodb://admin:adminpassword@localhost:27017/smart_home?authSource=admin";
    await mongoose.connect(mongoURI);
}

class DatabaseService {

    constructor(model) {
        this.model = model;
    }

    async saveDocument(document) {
        return await document.save().catch(err => {
            logger.error("Error saving an document: ", err);
            throw err;
        });
    }

    async findAllDocuments() {
        return await this.model.find().catch(err => {
            logger.error("Error finding entities: ", err);
            throw err;
        });
    }
    
    async createDocument(document) {
        return new this.model(document).save().catch(err => {
            logger.error("Error creating an document: ", err, '\n', document);
            throw err;
        });
    }
    
    async findDocument(id) {
        return await this.model.findById(id).catch(err => {
            logger.error("Error finding an document: ", err);
            throw err;
        });
    }
    
    async updateDocument(id, updateData) {
        return await this.model.findByIdAndUpdate(id, updateData, { new: true }).catch(err => {
            logger.error("Error updating an document: ", err, '\n', updateData);
            throw err;
        });
    }
    
    async deleteDocument(id) {
        return await this.model.findByIdAndDelete(id).catch(err => {
            logger.error("Error deleting an document: ", err);
            throw err;
        });
    }
}

export class DeviceDatabaseService extends DatabaseService {
    constructor() {
        super(DeviceModel);
    }
}

export class RoomDatabaseService extends DatabaseService {
    constructor() {
        super(RoomModel);
    }
}

export class UserDatabaseService extends DatabaseService {
    constructor() {
        super(UserModel);
    }
}