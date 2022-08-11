import { JoiBase, JoiEmail, JoiPassword } from "./extended.validator";
import Joi from "joi"

const validator = ({ error, _ }, next) => (error ? next(error) : next());

const RolesValidator = async (req,res,next)=> {
    const schema = JoiBase.append({
        role:Joi.number().required(),
        slug:Joi.string().trim().required(),
        is_deleted: Joi.bool(),
        update_at: Joi.date()
    })
    validator(schema.validate(req.body),next)
}


export default {
    RolesValidator
}
