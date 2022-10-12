import {YuyuidEvent} from "@yuyuid/constants";
import {YuyuidEmitter, generateResetPasswordUrl, generateVerificationEmailUrl} from "@yuyuid/utils";
import {EmailService, EmailTemplate} from "src/lib/modules/email";

export const onSendRecoverPasswordEmail = async (email, token) => {
    const resetPasswordUrl = generateResetPasswordUrl(token);

    await EmailService.SendEmail(
        EmailTemplate.resetPassword,
        {to: email, subject: "Forgot Password"},
        {url: resetPasswordUrl},
    );
};

export const onSendVerificationEmail = async (email, token) => {
    const confirmEmailUrl = generateVerificationEmailUrl(token);

    await EmailService.SendEmail(
        EmailTemplate.verifyEmail,
        {to: email, subject: "Confirm your email"},
        {url: confirmEmailUrl},
    );
};


const onSendUpdateBookStatus = async (props = {}) => {
    let {email, room, _id} = props
    await EmailService.SendEmail(
        EmailTemplate.verifyEmail,
        {to: email, subject: "Booking Status Updated"},
        {url: [process.env.APP_URL, 'room', _id, room?.name].join("/")},
    );
}
const onSendUpdateBookCreated = async (props = {}) => {
    let {email, url} = props
    await EmailService.SendEmail(
        EmailTemplate.book.create,
        {to: email, subject: "Booking Created"},
        {
            url: url
        },
    );
}

YuyuidEmitter.on(YuyuidEvent.email.book.create, onSendUpdateBookCreated)
YuyuidEmitter.on(YuyuidEvent.email.book.update.status, onSendUpdateBookStatus)
YuyuidEmitter.on(YuyuidEvent.email.recoverPassword, onSendRecoverPasswordEmail);
YuyuidEmitter.on(YuyuidEvent.email.verificationEmail, onSendVerificationEmail);
