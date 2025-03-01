import express from 'express';
import logging from 'logging';

import deviceRoutes from './routes/device.routes.js';
import roomRoutes from './routes/room.routes.js';
import userRoutes from './routes/user.routes.js';

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

    // Routes
    const routes = [deviceRoutes, roomRoutes, userRoutes];
    for (const route of routes) {
        app.use('/api/v1', route);
    }

    // Database
    await connectToDatabase();

    // Swagger 
    serveSwagger(app, port);
});