import { Router } from 'express'
const route = Router()
import Roles from './roles'

export default (app)=> {
    app.use('/permissions',route)
    Roles(app)
}
