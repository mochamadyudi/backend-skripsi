import { validator } from './validator'
import {JoiBase} from "./extended.validator";
import Joi from "joi";

const RoleCreate = async (req,res,next)=> {
    const schema = JoiBase.append({
        name : Joi.string().required(),
        privileges: Joi.array().items(
            Joi.object({
                resource: Joi.string().required(),
                actions: Joi.array().items(
                    Joi.string().required()
                ).required()
            }).required()
        ).required()
    })
    validator(schema.validate(req.body),res,next)
}
export default {
    RoleCreate
}
