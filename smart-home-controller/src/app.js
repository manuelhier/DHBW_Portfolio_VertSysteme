import express from 'express';
import logging from  'logging';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();

const logger = logging.default('app');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Smart Home Controller API',
            version: '1.0.0',
            description: 'A simple API to control smart home devices'
        },
    },
    apis: ['./src/routes/*.js']
};
const swaggerDoc = swaggerJsDoc(options);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Middleware
app.use(express.json());


// Routes


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`Server is running on Port ${PORT}. http://localhost:${PORT}`);
});