import express from 'express';
import logging from 'logging';

import controllers from './routes/index.js';
import connectToDatabase from './utils/database.js';

const logger = logging.default('APP');
const port = process.env.PORT || 8080;

const app = express();


// Inject Middleware
app.use(express.json());


// Start the server
app.listen(port, async () => {
    logger.info(`Server is running on Port ${port}`);

    // Database
    await connectToDatabase();

    // Routes
    for (const controller of controllers) {
        app.use('/api/v1', controller);
    }

    // Swagger 
    serveSwagger(app, port);
});