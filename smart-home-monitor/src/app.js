import express from 'express';
import logging from 'logging';

import configureMqttConnection from './utils/mqtt.js';

const logger = logging.default('APP');
const port = process.env.PORT || 9090;

const app = express();


// Start the server
app.listen(port, async () => {
    logger.info(`Server is running on Port ${port}`);

    try {
        // MQTT
        configureMqttConnection();
        logger.info('Connection to MQTT Broker established 📢');
        
    } catch (err) {
        logger.error('Fehler:', err);
        throw new Error('Server konnte nicht gestartet werden');
    }

});