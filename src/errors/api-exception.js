const mongoose = require('mongoose');

const handleException = (error, next) => {
    if (error instanceof mongoose.Error.ValidationError) {
        next(error);
    } else if (error instanceof ApiException) {
        next(error);
    } else {
        next(new UnhandledException(error));
    }
}

class ApiException extends Error {
    constructor(httpCode, message, details, innerError) {
        super(message);
        this.httpCode = httpCode;
        this.details = details;
        this.innerError = innerError;
		this.message = message;
    }
}

class UnhandledException extends ApiException {
    constructor(
        error,
        details
    ) {        
            super(
                500,
                'Something went wrong. Please try again',
                details,
                error
            );        
    }
}

module.exports = {
    handleException, 
    ApiException,
    UnhandledException
}