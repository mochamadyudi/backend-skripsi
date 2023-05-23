import YuyuidError from "../exceptions/yuyuidError";
import { isCelebrateError } from "celebrate";


const ExpressErrorHandler = (err, req, res, next) => {
    const {status, message, error} = err;
    const errObj = {
        status: status ||500,
        message,
        error:err
    }
    if (err.name === "UnauthorizedError") {
        errObj.error = "You don't have permission to do that. Sorry!";
    } else if (err instanceof YuyuidError.Boom) {

        /* Handle KsiError */
        errObj.error = err.output.payload.error;
        errObj.status = err.output.statusCode;
    } else if (err.name === "ValidationError") {
        errObj.error = "Validation Failed";
        errObj.status = 400;
    } /* Handle Joi Validation */ else if (isCelebrateError(err)) {

        errObj.error = "Validation Failed";
    }
    return res.status(errObj.status).json({
        ...errObj,
        error:true,
        message: errObj?.message,
        data: err
    })
}

export default ExpressErrorHandler
