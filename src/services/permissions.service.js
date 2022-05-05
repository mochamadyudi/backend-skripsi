import {UpRole, User} from "@yuyuid/models";
import YuyuidError from "@yuyuid/exception";
import BodyResponse from "../lib/handler/body-response";

export class PermissionsService {
    static async Create(userInput){
        await PermissionsService.verifyRolesBySlug(userInput.slug)
        return await PermissionsService.createRoles(userInput)
    }




    static async createRoles(userInput){
        const {role,slug,is_deleted,updated_at,date} = userInput

        const roles = new UpRole({
            role,slug,is_deleted,updated_at,date
        });

        const newRoles = await roles.save();
        Reflect.deleteProperty(newRoles,"__v");
        Reflect.deleteProperty(newRoles,"is_deleted");
        return new BodyResponse({error:false,success:true,message:"Success! berhasil membuat permissions role. ",data:newRoles})
    }

    static async FindRolesByName(role){
        let roles
        switch (role){
            case "admin":
                roles = await UpRole.findOne({role:2}).populate("role",["slug"]);
                break;
            case "villa":
                roles = await UpRole.findOne({role:3}).populate("role",["slug"]);
                break;
            case "customer":
                roles = await UpRole.findOne({role:4}).populate("role",["slug"]);
                break;
            case "guest":
                roles = await UpRole.findOne({role:5}).populate("role",["slug"]);
                break;
            default:
                roles = await UpRole.findOne({role:4}).populate("role",["slug"]);
                break;
        }

        return roles;
    }

    static async verifyRolesBySlug(slug){
        const roles = await UpRole.findOne({slug})
        if(roles !== null) throw YuyuidError.badRequest('Roles has a been Created.');
    }

    static async verifyRoles(id){
        const roles = await UpRole.findOne({id})
        if(roles !== null) throw YuyuidError.badRequest('Roles has a been Created.');

    }
}
