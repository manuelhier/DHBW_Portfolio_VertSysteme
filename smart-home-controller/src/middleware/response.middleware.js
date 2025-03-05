import logging from 'logging';

const logger = logging.default('ERROR');

function addErrorHandlerMiddleware(err, req, res, next) {
    const errStatus = err.status || err.name === 'ValidationError' ? 400 : 500;
    const errMessage = err.message || 'Internal Server Error';

    logger.error(err.stack);
    res.status(errStatus).json({
        error: {
            status: errStatus,
            message: errMessage,
        }
    });

    next();
}

export default addErrorHandlerMiddleware;