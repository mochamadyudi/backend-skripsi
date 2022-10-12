import Email from "email-templates";
import { createTransport } from "nodemailer";
import sendGridTransport from "nodemailer-sendgrid";
import { EmailConstant } from "./email.constant";
import { YuyuidConfig } from "@yuyuid/config";
import { join } from "path";

export class EmailService {
  static getInstance() {
    if (!this.transporter || !this.email) {
      const { apiKey, emailFrom } = YuyuidConfig.sendGrid;
      const options = { apiKey };
      this.transporter = createTransport(sendGridTransport(options));

      this.email = new Email({
        message: {
          from: {
            name: "Bitevo",
            address: emailFrom,
          },
        },
        send: true,
        preview: true, // TODO change preview = false when deploy to production server
        transport: this.transporter,
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            relativeTo: EmailConstant.STYLE_PATH,
            // images: true,
          },
        },
        views: {
          options: {
            extension: "pug",
          },
        },
      });
    }

    return { email: this.email, transporter: this.transporter };
  }

  /**
   * Send Email
   *
   * @param {string} templateName - Email Template
   * @param {{subject: string, to}} options - Email Options
   * @param {object} data - Data which you want to send in email
   *
   * @returns {Promise<boolean>} Return true if sent successfully
   */
  static async SendEmail(templateName, options, data) {
    const { email } = EmailService.getInstance();

    await email
      .send({
        template: join(EmailConstant.EMAIL_TEMPLATE_PATH, templateName),
        message: options,
        locals: { ...data },
      })
      .then(() => console.log("Email has been sent"))
      .catch((err) => console.error(err));

    return true;
  }

  static async SendTextEmail(options) {
    const { email } = EmailService.getInstance();

    await email
      .send({ message: options })
      .then(() => console.log("Email has been sent"))
      .catch((err) => console.error(err));

    return true;
  }
}
