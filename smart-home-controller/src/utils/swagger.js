import logging from 'logging';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const logger = logging.default('SWAGGER');

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

const swaggerSpec = swaggerJsDoc(options);

function serveSwagger(app, port) {

    // Swagger UI
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Swagger Docs
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    logger.info(`Swagger UI available at:    http://localhost:${port}/swagger`);
    logger.info(`Swagger Docs available at:  http://localhost:${port}/swagger.json`);
}

export default serveSwagger;
