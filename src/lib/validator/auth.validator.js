import { JoiBase, JoiEmail, JoiPassword } from "./extended.validator";
import Joi from "joi"

const validator = ({ error, _ }, next) => (error ? next(error) : next());

const signupValidator = async (req,res,next)=> {
    const schema = JoiBase.append({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        username: Joi.string().trim().required(),
        email: JoiEmail.required(),
        role:Joi.string().trim().required(),
        password: JoiPassword.required()
    })

    validator(schema.validate(req.body),next)
}

const signinValidator = async (req,res,next)=> {
    const schema = JoiBase.append({
        email: JoiEmail.required(),
        password: Joi.string().trim().required(),
    })
    validator(schema.validate(req.body),next)
}


export default {
    signupValidator,
    signinValidator
}
