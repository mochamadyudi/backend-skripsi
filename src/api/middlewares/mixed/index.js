import {isAuth} from '../auth'

// const protectUser = [AuthMiddleware.auth,AuthMiddleware.isAuth,AuthMiddleware.verifyCurrentUser]
const protectLogin = [isAuth]
export default {  protectLogin}
