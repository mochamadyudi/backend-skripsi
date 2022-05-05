import { YuyuidConfig } from "@yuyuid/config";

/**
 * Generate Forgot Password Url
 *
 * @param {string} token Token
 *
 * @returns {string} Return Url
 */
const generateResetPasswordUrl = (token) => {
    return `${YuyuidConfig.resetPasswordUrl}/${token}`;
};

const generateVerificationEmailUrl = (token) => {
    return `${YuyuidConfig.verifyEmailUrl}/${token}`;
};

export { generateResetPasswordUrl, generateVerificationEmailUrl };
