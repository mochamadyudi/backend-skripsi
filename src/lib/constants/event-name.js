const YuyuidEvent = {
    email: {
        recoverPassword: "onSendRecoverPasswordEmail",
        verificationEmail: "onSendVerificationEmail",
        book:{
            create:"onSendEmailCreatedBook",
            update:{
                status:"onSendEmailUpdateBookStatus"
            }
        }
    },
    book:{
        create:"onBookCreated",
        update:{
            status:"onBookUpdateStatus"
        }
    }
};

Object.freeze(YuyuidEvent);

export { YuyuidEvent };
