import { Router } from 'express'
import travels from './travels'
export default ()=> {
    const app = Router();
    // app.use(isAuth);
    travels(app)

    // RouteUser(app)
    return app;
}
