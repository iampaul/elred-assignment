const { ApiException, UnhandledException } = require("../errors/api-exception");
const mongoose = require('mongoose');

const unhandledErrorHandler = (error, request, response, next) => {
    let err;
    if (error instanceof mongoose.Error.ValidationError) {
        const errors = {};        
        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        }); 
        return response.status(400).send({        
            message: "Validation failed",
            errors: errors
        });       
        
    } else if (error instanceof ApiException) {
        err = error;
    } else {
        err = new UnhandledException(error);
    }

    // Log errors other than 4xx errors
    if (err.httpCode >= 500 || err.httpCode < 400) {
        console.log(
            /*JSON.parse(
                JSON.stringify(error)
            )*/
            error
        );
        if (err.httpCode === 503) {

            // Tell the client to retry after 1 minute
            response.setHeader('Retry-After', 60)
        }
    }
    response.status(err.httpCode).send({        
        message: err.message,
        data: err.details
    });
}

const routeErrorHandler = (request, response, next) => {
    if (!request.route) {
        response.status(404).send({            
            message: 'Requested resource could not be found',
            resourcePath: request.path,
            method: request.method
        });
    }
    next();
}

module.exports = {
    unhandledErrorHandler,
    routeErrorHandler
}
