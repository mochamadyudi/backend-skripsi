import {Profile, User} from '@yuyuid/models'
import YuyuidError from "@yuyuid/exception";
import BodyResponse from "../lib/handler/body-response";

export class UserService {

    static async create(userInputDto) {
        try {
            const {firstName, lastName, email, password, salt, role, username} = userInputDto

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
            return [null, user];
        } catch (err) {
            return [err, null]
        }
    }

    static async firstAddProfile(id = null, isadmin = false) {
        if (id !== null) {
            const profile = new Profile({
                user: id,
                is_admin:isadmin,
            })
            await profile.save();

        }
    }

    static async getMyProfile(id = null) {
        if (id !== null) {
            const profile = await Profile.findOne({user: id}).populate("user", ["name", "avatar"]);
            return profile
        }
    }

    static async UserChecked(id = null) {
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
    static async UserLoaded(id) {
        try {
            const user = await UserService.UserChecked(id)
            const profile = await UserService.getMyProfile(id)

            return {
                profile,
                user
            }
        } catch (e) {
            return {
                user: null,
                profile: null
            }
        }
    }

    static async GetToken(req) {
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
            // return [null, user.length > 0];
            return true;
        } catch (err) {
            return [err, null];
        }
    }

    static async updateProfile(userInput = {}) {
        try {
            const fields = {
                user: userInput.id,
                contact: userInput.contact ?? null,
                location: {
                    lat: userInput.location_lat ?? null,
                    long: userInput.location_long ?? null,
                },
                social: {
                    youtube: userInput.youtube ?? null,
                    twitter: userInput.twitter ?? null,
                    facebook: userInput.facebook ?? null,
                    instagram: userInput.instagram ?? null,
                },
                bio: userInput.bio ?? null,
                address: userInput.address ?? [],
                status: userInput.status ?? null

            }

            try {
                let profile = await Profile.findOne({user: userInput.id});
                //Look for profile by user
                if (profile) {
                    //update!
                    profile = await Profile.findOneAndUpdate(
                        {user: userInput.id},
                        {$set: fields},
                        {new: true}
                    );
                    return new BodyResponse({
                        error: false,
                        status: 200,
                        message: "Profile has been updated!",
                        data: profile,
                    })
                }
                //Create
                profile = new Profile(fields);
                await profile.save();
                return new BodyResponse({
                    error: false,
                    status: 200,
                    message: "Profile has been updated!",
                    data: profile,
                })
            } catch (err) {
                console.error(err.message);
                return new BodyResponse({
                    error: true,
                    status: 500,
                    message: "Server Error in Profile.js",
                })
            }

        } catch (err) {
            return new BodyResponse({error: true, message: err.message})
        }
    }
}


