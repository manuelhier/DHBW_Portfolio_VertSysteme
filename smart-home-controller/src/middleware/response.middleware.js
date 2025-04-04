import logging from 'logging';

const logger = logging.default('ERROR');

function addErrorHandlerMiddleware(err, _req, res, next) {
    const errStatus = err.status ? err.status : 500;
    const errMessage = err.message ? err.message : 'Internal Server Error';

    // logger.warn(err.stack);
    res.status(errStatus).json({
        error: {
            status: errStatus,
            message: errMessage
        }
    });

    next();
}

export default addErrorHandlerMiddleware;