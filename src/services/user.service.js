import {Profile, User} from '@yuyuid/models'
import YuyuidError from "@yuyuid/exception";
export class UserService {

    static async create(userInputDto){
        try{
            const {firstName,lastName,email,password,salt,role,username} = userInputDto

            const user = new User({
                firstName,
                avatar: null,
                username,
                lastName,
                email,
                password,
                salt,
                role
            });
            await user.save();
            return [null,user];
        }catch(err){
            return [err,null]
        }
    }

    static async firstAddProfile(id = null){
        if (id !== null){
            const profile = new Profile({user:id})
            await profile.save();

        }
    }

    static async getMyProfile(id = null){
        if (id !== null){
            const profile = await Profile.findOne({user: id}).populate("user", ["name", "avatar"]);
            return profile
        }
    }

    static async UserChecked(id = null){
        if (id === null) throw YuyuidError.badRequest('id not null.')
        const user = await User.findById(id).select("-password").select("-salt");
        if (!user) throw YuyuidError.badRequest('user not found.')

        return user
    }


    /**
     * @used - [ ROUTE ]
     * @param id
     * @returns {Promise<{profile: *}>}
     * @constructor
     */
    static async UserLoaded(id){
        const user = await UserService.UserChecked(id)
        const profile = await UserService.getMyProfile(id)

        return {
            profile,
            user
        }
    }

    static async GetToken(req){
        if (
            (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Token") ||
            (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer")
        ) {
            return req.headers.authorization.split(" ")[1]
        }

    }


    static async update(userInputDto) {
        try {
            // const user = await User.update(userInputDto, { where: { id: userInputDto.userId } });
            // return [null, user?.length > 0];
            return true;
        } catch (err) {
            return [err, null];
        }
    }
}


