import config from 'config';

export const YuyuidConfig = {
    apiPrefix: config.get("api.prefix"),
    jwtSecret: config.get("api.jwtSecret"),
    jwtSecretActivate: config.get("api.jwtSecretActivate"),
    port: config.get("api.port"),
    sendGrid: config.get("sendgrid"),
    resetPasswordUrl: config.get("url.resetPassword"),
    verifyEmailUrl: config.get("url.verifyEmail"),
    db: {
        name: config.get("db.name"),
        username: config.get("db.username"),
        password: config.get("db.password"),
        host: config.get("db.host"),
        dialect: config.get("db.dialect")
    }
};
//# sourceMappingURL=default.config.js.map