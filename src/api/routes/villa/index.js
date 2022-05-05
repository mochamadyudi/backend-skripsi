import { Router } from 'express'
import SelfRoute from './self'
import PublicRoute from './public'
export default ()=> {
    const app = Router();
    app.use('/self', SelfRoute())
    PublicRoute(app)
    return app;
}
