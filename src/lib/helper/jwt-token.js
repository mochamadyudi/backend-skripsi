import 'dotenv/config';
import jwt from 'jsonwebtoken';
class JwtToken {
    constructor(props = {}) {
        this.token = props?.token ?? null
        this.data = props?.data ?? null
        this.callback = props?.callback ?? function(){}
        this.options  = props?.options ?? {
            expiresIn: process.env.JWT_EXPIRES ?? "10d"
        }
    }

    async generate(){
        let JWTSign = {
            ...this.data,
            timestamp:Date.now()
        }
        this.callback(JWTSign)
        return jwt.sign(
            JWTSign,
            process.env.JWT_SECRET,
            this.options
        )
    }
    decode(){
        try{
            if(this.token){
                return [
                    null,
                    jwt.verify(this.token,process.env.JWT_SECRET)
                ]
            }
            return [new Error("Error: token must be defined!"),null]
        }catch (err){
            return [ err, null ]
        }

    }

}
export { JwtToken }