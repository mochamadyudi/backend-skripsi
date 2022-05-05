import AuthMiddleware from '../auth';

// const protectUser = [AuthMiddleware.auth,AuthMiddleware.isAuth,AuthMiddleware.verifyCurrentUser]
const protectLogin = [AuthMiddleware.auth];
export default { protectLogin };
//# sourceMappingURL=index.js.map