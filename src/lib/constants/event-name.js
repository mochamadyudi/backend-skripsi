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
    },
    notify: {
        book: {
            push: "onPushNotifyBook",
            update:{
                status:"onPushNotifyUpdateStatus",
                bulk_read: "onPushNotifyUpdateBulkRead"
            }
        }
    },
    tmp: {
        queue:{
            rooms:'onTmpQueueRoomsCreate'
        }
    }
};

Object.freeze(YuyuidEvent);

export { YuyuidEvent };
