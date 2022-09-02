import {ObjResolve} from "@yuyuid/utils";

export const validator = ({error, _}, res,next) => {
    if(error){
        let message = ""
        if(ObjResolve(error,"details")){
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
        res.json({
            error:true,
            message:message,
            data:error
        })
    }
    next()
};
