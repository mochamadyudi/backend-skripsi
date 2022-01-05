import YuyuidError from '@yuyuid/exception';
import {isCelebrateError } from "celebrate";

const expressErrorHandler = (err,req,res,next)=> {
    const { status, message, errors } = err
    const errorObject = {
        status : status || 500,
        message,
        error: err,
    }

    if (err.name === "UnauthorizedError"){
        errorObject.error = "You don't have permission to do that. Sorry!";
    }else if (err instanceof YuyuidError.Boom){
        errorObject.error = err.output.payload.error;
        errorObject.status = err.output.statusCode;
    } else if(err.name === "ValidationError"){
        errorObject.error = "Validation Failed";
        errorObject.status = 400;
    } else if (isCelebrateError(err)){
        errorObject.error = "Validation Failed";
    }
    return res.status(errorObject.status).error(errorObject)

    next()
}

export default expressErrorHandler
