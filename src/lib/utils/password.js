import bcrypt from "bcryptjs";

/**
 *  Hash Passoword
 *
 * @param {string} password password to encrypt
 *
 * @returns {Promise<object>{hashedPassword, salt}} Return Hashed Password and Salt
 */
const encryptPassword = async (password) => {
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);
    return { hashedPassword, salt };
};



export { encryptPassword };
