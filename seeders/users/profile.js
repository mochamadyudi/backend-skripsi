import {Profile} from '@yuyuid/models'

const ProfileSeeders = {
    data: [
        {
            "_id": "6200018a3f2b1398169b0675",
            "user": "6200018a3f2b1398169b0673",
            "contact": null,
            "location": {
                "lat": null,
                "long": null
            },
            "status": null,
            "bio": null,
            "social": {
                "twitter": null,
                "facebook": null,
                "instagram": null
            },
            "address": [],
            "date": "2022-02-06T17:12:42.724Z",
            "__v": 0
        }
    ],
    initial: async ()=> {
        try{
            await Profile.deleteMany();
            await Profile.insertMany(ProfileSeeders.data)
            console.log('PROFILE : Data Imported');
        }catch(e){
            console.error(e.message)
            process.exit(1)
        }
    },
    destroy: async ()=> {
        try {
            await Profile.deleteMany();
            console.log('PROFILE : Data Destroyed');
        } catch (err) {
            console.log(err);
            process.exit();
        }
    }
}

export {ProfileSeeders}