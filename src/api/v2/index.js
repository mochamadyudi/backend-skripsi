import { Router } from 'express'
import AuthRoute from './auth/index'
const route = Router()
export default ()=> {
    const app = Router()
    AuthRoute(app)

    return app
}
