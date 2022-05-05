import { MixedMiddlewares } from "@yuyuid/middlewares";
import { Router } from 'express';
import travels from './travels';
import { YuyuidConfig } from "@yuyuid/config";
// import auth from "../auth";
// import RouteUser from './users'
const jwt = require("jsonwebtoken");

export default (() => {
    const app = Router();
    app.use(MixedMiddlewares.protectLogin);
    travels(app);
    // RouteUser(app)
    return app;
});
//# sourceMappingURL=index.js.map