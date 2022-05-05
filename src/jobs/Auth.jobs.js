import {ForgotPassword} from "../models/auth/forgot_password.schema";
import moment from "moment";

export default class AuthJobs {
    static async RemoveOTP(){

    }

    static async RemoveActivation(){

    }

    static async RemoveForgotPasswordToken(){
        // console.log("Deleting expired OTP...");
        // await ForgotPassword.remove({expiredOn: moment(Date()).isUTC(true)})
        // console.log("Expired OTP deleted successfuly.");
    }
}
