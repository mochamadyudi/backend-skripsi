import { Router } from 'express'
import {AuthValidator} from "../../lib/validator";
import {AuthService} from "@yuyuid/services";


const route = Router()

export default (app)=> {
    app.use('/auth', route)
    route.post("/signup", AuthValidator.signupValidator, async (req, res, next) => {
        try {
            const newUser = await AuthService.SignUp(req.body);
            return res.json({ message: "Register successfully", ...newUser }).status(201);
        } catch (e) {
            return next(e);
        }
    });
    route.post("/signin", AuthValidator.signinValidator, async (req, res, next) => {
        try {
            const newUser = await AuthService.SignIn(req.body);
            return res.json({ message: "Sign successfully", ...newUser }).status(201);
        } catch (e) {
            return next(e);
        }
    });


}
