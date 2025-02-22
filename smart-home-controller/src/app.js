import express from 'express';
import logging from 'logging';

import controllers from './routes/index.js';
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
    for (const controller of controllers) {
        app.use('/api/v1', controller);
    }

    // Database
    await connectToDatabase();

    // Swagger 
    serveSwagger(app, port);
});