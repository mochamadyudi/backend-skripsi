import { validator } from './validator'
import {JoiBase} from "./extended.validator";
import Joi from "joi";

const Create = async (req,res,next)=> {
    const schema = JoiBase.append({
        name:Joi.string().required(),
        description:Joi.string().trim().required(),
        limit: Joi.number().required(),
        price: Joi.object({
            regular: Joi.number().required(),
            special: Joi.number().required(),
            discount: Joi.number(),
        }).required(),
        unit: Joi.string().required(),
        currency: Joi.string().required(),
        facility: Joi.object({
            ac: Joi.bool().required(),
            tv: Joi.bool().required(),
            wifi: Joi.bool().required(),
            bed_type: Joi.any().required(),
            smooking: Joi.bool().required(),
            other: Joi.string().required(),
        }),
        is_available:Joi.bool(),
        status: Joi.any(),
        seen: Joi.any(),
        is_deleted: Joi.bool()
    })
    validator(schema.validate(req.body),res,next)
}
export default {
    Create
}
