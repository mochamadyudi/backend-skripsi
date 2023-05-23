import {UpRolePermissions, User} from "@yuyuid/models";
import YuyuidError from "@yuyuid/exception";
import bcrypt from 'bcryptjs'
import {UserService, ThemeService, CartService} from "@yuyuid/services"
import {YuyuidEmitter, encryptPassword, generateToken, generateCustomToken, ObjResolve} from "@yuyuid/utils";

import {YuyuidEvent} from "@yuyuid/constants";
import {Activations} from "../models/auth";
import VillaService from "./villa.service";
import {ForgotPassword} from "../models/auth/forgot_password.schema";
import moment from "moment";
import jwt from "jsonwebtoken";
import {YuyuidConfig} from "@yuyuid/config";
import {_MVilla} from "@Modules";
import LibService from "./lib.service";


export class AuthService  extends  LibService{

    constructor(props) {
        super(props);
        this.schema = props?.schema ?? User
    }

    static async SignUp(req) {
        let userInputDto = req.body

        await AuthService.VerifyUniqueEmail(userInputDto.email)
        const {hashedPassword, salt} = await encryptPassword(userInputDto.password)
        Reflect.set(userInputDto, "password", hashedPassword)
        Reflect.set(userInputDto, "salt", salt)

        const [err, user] = await UserService.create(userInputDto)
        if(err) return [ err , null ]

        let villaFields = {}
        switch (userInputDto.role) {
            case "villa":
                if(ObjResolve(userInputDto,'villa')){
                    if(typeof(ObjResolve(userInputDto,'villa')) === "object"){
                        Object.keys(ObjResolve(userInputDto,'villa')).forEach((key)=> {
                            Reflect.set(villaFields,key,ObjResolve(userInputDto,'villa')[key])
                        })
                    }
                }
                const villa = await VillaService.createVilla({user: user.id,...villaFields})
                await ThemeService.VillaSetTheme(villa.id, 1)
                console.log({villa})
                break;
            case "customer":
                await UserService.firstAddProfile(user.id,false)
                await CartService.FirstAddCart(user.id)
                await ThemeService.SetTheme(user.id, 1)
                break;
            case "admin":
                await UserService.firstAddProfile(user.id, true)
                break;
            default:
                await UserService.firstAddProfile(user.id)
                await CartService.FirstAddCart(user.id)
                await ThemeService.SetTheme(user.id, 1)
        }

        const token = await generateCustomToken({user})

        const activate = new Activations({
            user: user.id,
            refType: "user",
            ip_address:req.ip,
            token
        });
        await activate.save();

        // console.log(user,err)
        if (err)  return [new Error("User can't be created."),null]
        //



        // console.log({id:user?.id,token})
        Reflect.set(user, "token", token)
        Reflect.set(user, "email", userInputDto.email)
        Reflect.deleteProperty(user, "salt");
        Reflect.deleteProperty(user, "password");

        YuyuidEmitter.dispatch(YuyuidEvent.email.verificationEmail, userInputDto.email, token);
        return [ null, user];
    }


    /**
     * CREATE ACTIVATE TOKEN
     * @param id
     * @param type
     * @param ip_address
     * @returns {Promise<void>}
     */
    static async createActivationsToken(id, type, ip_address = null) {
        try {
            const checked = await Activations.findOne({user: id})
            if (checked !== null) throw YuyuidError.badRequest('Email has a been registered.');
            // generateTokenActivate

            const activate = new Activations({
                user: id,
                refType: type,
                ip_address,
                token
            });
            await activate.save();
            return {
                error:false,
                message: null,
                data:activate,
                token
            }
        } catch (err) {
            return {
                error:true,
                message: err.message,
                data:null,
                token:null
            }
        }
    }

    /**
     *
     * @param id
     * @returns {Promise<void>}
     * @constructor
     */
    static async CheckedIsVerifyEmail(id) {
        try {
            const user = await User.findOne({id})
            if (!user) return {error: false, verify: false}

            if (typeof (user.is_verify) !== "undefined") {
                if (user.is_verify) {
                    return {
                        error: false,
                        verify: true
                    }
                } else {
                    return {
                        error: false,
                        verify: false
                    }
                }
            }

        } catch (err) {
            return {
                error: true,
                verify: false
            }
        }
    }


    static async VerifyUniqueEmail(email) {
        const user = await User.findOne({email})
        if (user !== null) throw YuyuidError.badData('Email has a been registered.');

    }

    static async VerifyCheckEmailUser(email) {
        const user = await User.findOne({email})
        if (user === null) throw YuyuidError.badRequest('Email tidak ditemukan!. silahkan register ')

        return user
    }

    static async isMatchPassword(password, password2, message = '') {
        const isMatch = await bcrypt.compare(password, password2);
        if (!isMatch) throw YuyuidError.badRequest('Password tidak sama.')
    }

    static async SignIn(userInputDto) {
        const user = await AuthService.VerifyCheckEmailUser(userInputDto.email)

        const {verify} = await AuthService.CheckedIsVerifyEmail(user.id)

        await AuthService.isMatchPassword(userInputDto.password, user.password)

        const payload = {
            verify,
            user: {
                id: user.id,
                role: user.role,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            }
        };
        // const profile = await UserService.getMyProfile(user.id)
        if(user.role){
            switch (user.role){
                case "villa":
                    const [errVilla,villa] = await new _MVilla.Service({
                        orderBy:"user",
                        id: user.id
                    })._detailVilla()

                    if(villa){
                        Reflect.set(payload.user,'villaId',villa?._id ?? undefined);
                    }
                    break;
                default:
                    break;
            }
        }


        const token = await generateCustomToken(payload)

        return {
            ...payload,
            token,
        }
    }

    static async RolesPermissions(id, role_id) {
        await UpRolePermissions.insertMany({
            user: id,
            role: role_id
        })
    }


    static async forgotPassword(req, res) {
        try {
            const {email} = req.body
            const user = await AuthService.VerifyCheckEmailUser(email)
            let data = {
                user: user.id,
                email,
                ip_address: req.ip
            }
            const token = generateCustomToken({...data})

            const expiresOn = moment(new Date()).seconds(60)

            const addForgot = new ForgotPassword({
                user: user.id,
                ip_address: req.ip,
                token : token,
                expiredOn: expiresOn,
            })
            //
            await addForgot.save();
            YuyuidEmitter.dispatch(YuyuidEvent.email.recoverPassword, user.email, token);

            return res.json({
                error: false,
                message: "Successfully!",
                data: addForgot
                // data:
            })
        } catch (err) {
            res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    }


    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     * @constructor
     */
    static async ResetPassword(req,res){
        try{
            const {token} = req.params
            const body = req.body
            const {email} = jwt.verify(token, YuyuidConfig.jwtSecret);
            const {hashedPassword, salt} = await encryptPassword(body.password)
            Reflect.set(body, "password", hashedPassword)
            Reflect.set(body, "salt", salt)
            const user = await User.findOneAndUpdate(
                {email: email},
                {$set: {
                        password:body.password,
                        salt
                }},
                {new: true}
            );

            return res.json({
                error:false,
                message: "Successfully!",
                data:user
            }).status(200)
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            }).status(500)
        }
    }


    static async ChangePassword(req,res){
        try{
            let {id} = req.user
            const userInput = req.body
            const user = await User.findOne({id})

            await AuthService.isMatchPassword(userInput.old_password,user.password)

            const {hashedPassword, salt} = await encryptPassword(userInput.password)
            Reflect.set(userInput, "password", hashedPassword)
            Reflect.set(userInput, "salt", salt)

            // const {hashedPassword, salt} = await encryptPassword(userInput.password)
            // Reflect.set(userInput, "password", hashedPassword)
            // Reflect.set(userInput, "salt", salt)
            const NewUser = await User.findOneAndUpdate(
                {email: user.email},
                {$set: {
                        password:userInput.password,
                        salt
                    }},
                {new: true}
            );
            return res.json({
                error:false,
                message:"Successfully! password updated!",
                data:NewUser
            })
        }catch(err){
            return res.json({
                error:true,
                message: err.message,
                data: null
            })
        }
    }
    static async deleteUser(req,res){
        try{
            const {id} = req.params
            await User.findOneAndDelete({id})
            return res.json({
                error:false,
                message: `Remove ${id} Success!`,
                data: null
            })
        }catch(err){
            throw YuyuidError.badRequest(err.message)
        }
    }


    /**
     * ===============================================================
     *  NEW SERVICE
     * ===============================================================
     */
    async signUpAdmin(){
        try{
            const {hashedPassword, salt} = await encryptPassword(this.fields.password)
            await AuthService.VerifyUniqueEmail(this.fields?.email)
            Reflect.set(this.fields, "password", hashedPassword)
            Reflect.set(this.fields, "salt", salt)

            const data = new this.schema({
                ...this.fields,
                role:"admin"
            })


            const token = await generateCustomToken({user:data})

            const activate = new Activations({
                user: data.id,
                refType: "user",
                token
            });
            await activate.save();

            const saved = await data.save();

            YuyuidEmitter.dispatch(YuyuidEvent.email.verificationEmail, this.fields.email, token);
            Reflect.set(saved, "token", token)
            Reflect.set(saved, "email", this.fields.email)
            Reflect.deleteProperty(saved, "salt");
            Reflect.deleteProperty(saved, "password");

            return [ null, saved]
        }catch(err){
            return [ err , null ]
        }
    }

}
