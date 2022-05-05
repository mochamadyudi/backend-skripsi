import bcrypt from "bcryptjs";

/**
 *  Hash Passoword
 *
 *
 * @returns {Promise<object>{hashedPassword, salt}} Return Hashed Password and Salt
 * @param str
 * @param length
 */
const encryptChar = async (str = '',length = 5) => {
    var salt = bcrypt.genSaltSync(length);
    var hashedPassword = bcrypt.hashSync(str, salt);
    return hashedPassword;
};



export { encryptChar };
