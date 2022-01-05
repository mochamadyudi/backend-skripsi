import Boom from '@hapi/boom';

/**
 * Returns Validation error
 *
 * @param {string} message — Optional message
 *
 * @returns {Boom} A 400 bad request error
 */
const validationError = (message)=> {
    const error = Boom.badRequest(message);
    error.reformat();
    error.output.payload.error = "Validation Failed"
    return error
}

/**
 * Predefined Collection of Errors
 *
 * See here to know more {@link https://www.npmjs.com/package/boom}
 *
 *
 */
const YuyuidError = {
    ...Boom,
    validationError,
};

export default YuyuidError
