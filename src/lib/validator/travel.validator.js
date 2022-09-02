import {JoiBase} from "./extended.validator";
import Joi from "joi";
import { validator } from './default.validator'

const CreateCategory = async (req,res,next)=> {
    const schema = JoiBase.append({
        name: Joi.string(),
        slug: Joi.string(),
        is_published: Joi.number(),
        is_verify: Joi.number(),
        about: Joi.object({
            title: Joi.string(),
            content: Joi.string()
        }),
        background:Joi.string(),
        date: Joi.date()
    })
    validator(schema.validate(req.body),res,next)
}


export default {
    CreateCategory
}
