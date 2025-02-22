import mongoose from 'mongoose';
import logging from 'logging';

const logger = logging.default('DB');

async function connectToDatabase() {

    const mongoURI = "mongodb://admin:adminpassword@localhost:27017/smart_home?authSource=admin";

    try {
        await mongoose.connect(mongoURI);
        logger.info('MongoDB verbunden 🚀');
    } catch (error) {
        logger.error('Verbindungsfehler:', error);
    }
}

export default connectToDatabase;
