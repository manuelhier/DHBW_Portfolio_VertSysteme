
class APIError extends Error {
    constructor(statusCode, message) {
        super();
        this.status = statusCode;
        this.message = message;
    }
}

export class BadRequestError extends APIError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

export class NotFoundError extends APIError {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}