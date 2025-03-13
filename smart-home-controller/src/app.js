import express from 'express';
import logging from 'logging';

import deviceRoutes from './routes/device.routes.js';
import roomRoutes from './routes/room.routes.js';
import userRoutes from './routes/user.routes.js';

import addErrorHandlerMiddleware from './middleware/response.middleware.js';

import configureMqttConnection from './utils/mqtt.js';
import connectToDatabase from './utils/database.js';
import serveSwagger from './utils/swagger.js';

const logger = logging.default('APP');
const port = process.env.PORT || 8080;

const app = express();

// Inject Middleware
app.use(express.json());

// Start the server
app.listen(port, async () => {
    logger.info(`Server is running on Port ${port}`);

    try {
        // Routes
        const routes = [deviceRoutes, roomRoutes, userRoutes];
        for (const route of routes) {
            app.use('/api/v1', route);
            logger.info(`Registered route: /api/v1${route.stack[0].route.path}`);
        }

        // Database
        await connectToDatabase();
        logger.info('Connection to Database established 🚀');

        // Response Middleware
        app.use(addErrorHandlerMiddleware);

        // MQTT
        configureMqttConnection();
        logger.info('Connection to MQTT Broker established 📢');
        
        // Swagger 
        serveSwagger(app);
        logger.info(`Swagger UI available at:    http://localhost:${port}/swagger`);
        logger.info(`Swagger Docs available at:  http://localhost:${port}/swagger.json`);

    } catch (err) {
        logger.error('Fehler:', err);
        throw new Error('Server konnte nicht gestartet werden');
    }

});