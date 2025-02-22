import express from 'express';
import logging from 'logging';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import controllers from './routes/index.js';
import connectToDatabase from './utils/database.js';

const app = express();

const logger = logging.default('APP');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Smart Home Controller API',
            version: '1.0.0',
            description: 'A simple API to control smart home devices'
        },
    },
    apis: ['./src/routes/*.controller.js']
};
const swaggerDoc = swaggerJsDoc(options);


// Middleware
app.use(express.json());






// Start the server
const port = process.env.PORT || 8080;

app.listen(port, async () => {
    logger.info(`Server is running on Port ${port}. http://localhost:${port}/swagger`);

    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    // Database
    await connectToDatabase();

    // Routes
    for (const controller of controllers) {
        app.use('/api/v1', controller);
    }

});