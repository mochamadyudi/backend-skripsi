import {Cart, CartInfo, User} from "@yuyuid/models";
import YuyuidError from "@yuyuid/exception";
import bcrypt from 'bcryptjs'
import { UserService, ThemeService, CartService} from "@yuyuid/services"
import {YuyuidEmitter, encryptPassword, generateToken, generateCustomToken} from "@yuyuid/utils";

import {YuyuidEvent} from "../lib/constants/event-name";


export class AuthService {

    static async SignUp(userInputDto){
        await AuthService.VerifyUniqueEmail(userInputDto.email)
        const { hashedPassword, salt} = await encryptPassword(userInputDto.password)
        Reflect.set(userInputDto, "password",hashedPassword)
        Reflect.set(userInputDto,"salt",salt)

        const [err,user] = await UserService.create(userInputDto)
        await UserService.firstAddProfile(user.id)
        await CartService.FirstAddCart(user.id)
        await ThemeService.SetTheme(user.id,1)

        // console.log(user,err)
        if (err) throw YuyuidError.internal("User can't be created.");
        //
        const token = generateCustomToken({user})



        Reflect.set(user,"token", token)
        Reflect.deleteProperty(user,"salt");
        Reflect.deleteProperty(user,"password");

        YuyuidEmitter.dispatch(YuyuidEvent.email.verificationEmail,user.email,token);

        // return {
        //     success:"testing"
        // }
        return {user};
    }


    static async VerifyUniqueEmail(email){

        const user = await User.findOne({ email })
        if(user !== null) throw YuyuidError.badRequest('Email has a been registered.');

    }

    static async VerifyCheckEmailUser(email){
        const user = await User.findOne({ email })
        if(user === null) throw YuyuidError.badRequest('Email tidak ditemukan!. silahkan register ')

        return user
    }

    static async isMatchPassword(password,password2, message = ''){
        const isMatch = await bcrypt.compare(password, password2);
        if(!isMatch) throw YuyuidError.badRequest('Password tidak sama.')
    }

    static async SignIn(userInputDto){
        const user = await AuthService.VerifyCheckEmailUser(userInputDto.email)

        await AuthService.isMatchPassword(userInputDto.password,user?.password)

        // const profile = await UserService.getMyProfile(user?.id)
        const payload = {
            user: {
                id:user.id,
                role: user.role,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            }
        };
        console.log(payload)
        const token = generateCustomToken(payload)

        return {
            token,
        }
    }


}
