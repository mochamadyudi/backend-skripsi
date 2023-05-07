import {BodyResponse} from "@handler";

export const validator = ({error, _}, res,next) => {
    if(error){
        let message = ""
        if(typeof(error?.details) !== 'undefined'){
            if(Array.isArray(error?.details)){
                for(let i = 0; i < error?.details.length;i++){
                    if(i > 0){
                        message += [error?.details[i].message,"&"].join(" ")
                    }else{
                        message += [error?.details[i].message]
                    }

                }
            }
        }
        res.status(400)
        return res.json(new BodyResponse({
            ...error
        }))
    }
    next()
};
