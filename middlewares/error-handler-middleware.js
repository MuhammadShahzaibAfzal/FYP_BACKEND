const ErrorHandlerService = require("../services/error-handling-service");

function errorHandlingMiddleware(err,req,res,next) {
    let statusCode = 500;
    let data = {
        message : 'Internal Server Error',
        ...(process.env.DEBUG_MODE === "true" && {
            originalError : err.message
        })
    }
    if(err instanceof ErrorHandlerService){
        statusCode = err.status;
        data = {
            message : err.message
        }
    }

    return res.status(statusCode).json(data);
}

module.exports = errorHandlingMiddleware;