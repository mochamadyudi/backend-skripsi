import { Router } from 'express';
import { AuthValidator } from "../../lib/validator";
import { AuthService } from "@yuyuid/services";
import { UpRole } from "@yuyuid/models";
import { PermissionsService } from "../../services/permissions.service";

const route = Router();

export default (app => {
    app.use('/auth', route);
    route.post("/signup", AuthValidator.signupValidator, async (req, res, next) => {
        try {

            const newUser = await AuthService.SignUp(req);
            // const roles = await PermissionsService.FindRolesByName(newUser.user.role)
            // await AuthService.RolesPermissions(newUser.user._id,roles.id)

            return res.json({ message: "Register successfully", newUser }).status(201);
        } catch (e) {
            return next(e);
        }
    });
    route.post("/signin", AuthValidator.signinValidator, async (req, res, next) => {
        try {
            const newUser = await AuthService.SignIn(req.body);
            return res.json({
                status: "success",
                message: "Sign successfully", newUser }).status(200);
        } catch (e) {
            return res.json({
                status: "error",
                message: e.message }).status(400);
        }
    });
});
//# sourceMappingURL=auth.js.map