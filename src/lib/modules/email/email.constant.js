import { join, resolve } from "path";

const assetsPath = resolve(__dirname, "assets");
const EMAIL_TEMPLATE_PATH = join(assetsPath, "templates");
const STYLE_PATH = join(assetsPath, "styles");

/**
 * Type definiftion of EmailConstant
 *
 * @typedef {object} EmailConstantType
 * @property {string} STYLE_PATH - Path of stylesheet
 * @property {string} EMAIL_TEMPLATE_PATH - Path of html | ejs | pug
 */

/**
 * @type {EmailConstantType}
 */
const EmailConstant = {
  STYLE_PATH,
  EMAIL_TEMPLATE_PATH,
};

Object.freeze(EmailConstant);

const EmailTemplate = {
  resetPassword: "reset-password",
  verifyEmail: "verify-email",
  book:{
    create:"book/create"
  }
};

export { EmailConstant, EmailTemplate };
