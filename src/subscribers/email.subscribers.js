import { YuyuidEvent } from "@yuyuid/constants";
import { YuyuidEmitter, generateResetPasswordUrl, generateVerificationEmailUrl } from "@yuyuid/utils";
import { EmailService, EmailTemplate } from "src/lib/modules/email";

export const onSendRecoverPasswordEmail = async (email, token) => {
    const resetPasswordUrl = generateResetPasswordUrl(token);

    await EmailService.SendEmail(
        EmailTemplate.resetPassword,
        { to: email, subject: "Forgot Password" },
        { url: resetPasswordUrl },
    );
};

export const onSendVerificationEmail = async (email, token) => {
    const confirmEmailUrl = generateVerificationEmailUrl(token);

    await EmailService.SendEmail(
        EmailTemplate.verifyEmail,
        { to: email, subject: "Confirm your email" },
        { url: confirmEmailUrl },
    );
};

YuyuidEmitter.on(YuyuidEvent.email.recoverPassword, onSendRecoverPasswordEmail);
YuyuidEmitter.on(YuyuidEvent.email.verificationEmail, onSendVerificationEmail);
