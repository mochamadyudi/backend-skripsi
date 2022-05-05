import {Activations} from "../models/auth";
import {Profile, User} from "@yuyuid/models";
import {decodeJwtToken} from "@yuyuid/utils";

export default class ActivationService {
    static async CheckedToken(token){
        try{
            const activate = await Activations.findOne({token})

            console.log({activate})
            if(!activate) return {
                status: false,
                data: null
            }
            const {user} = decodeJwtToken(token)
            Reflect.deleteProperty(user,"salt")
            Reflect.deleteProperty(user,"password")

            return {
                status: true,
                data: user
            }
        }catch(err){
            return {
                status: false,
                data: null
            }
        }
    }

    static async VerifyEmail(token){
        try{
            const {status,data} = await ActivationService.CheckedToken(token)

            console.log({status,data})
            if (status){
                const findUser = await User.findOne({email: data.email})
                if (findUser && findUser.is_verify === false){
                    const user = await User.findOneAndUpdate(
                        {email: data.email},
                        {$set: {
                                is_verify:true
                            }},
                        {new: true}
                    );
                    await Activations.deleteMany({token})
                    return {
                        error:false,
                        message: "data user anda telah di diverifikasi",
                        data: user
                    }
                }else{
                    await Activations.deleteMany({token})
                    return {
                        error:false,
                        message: "sudah di verifikasi",
                        data: findUser
                    }
                }

            }
            else{
                return {
                    error:true,
                    message: "Tidak menemukan Token!",
                    data: null
                }
            }
            // return {
            //                 error:true,
            //                 message: "data user anda telah di diverifikasi",
            //                 data: null
            //             }
        }catch(err){
            return {
                error:true,
                message: err.message,
                data: null
            }
        }
    }
}
