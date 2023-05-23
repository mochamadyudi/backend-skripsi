import {User} from '@yuyuid/models'

const UsersSeeders = {
    data: [
        {
            "_id": "6200018a3f2b1398169b0673",
            "role": "admin",
            "email": "admin@gmail.com",
            "firstName": "admin",
            "lastName": "1",
            "username": "admin",
            "password": "$2a$12$f.MA/m1n8/nMCcjjeBAYdO2fS3hC0L.kuFraYf2vR8BsLPmXko7Ym",
            "salt": "$2a$10$r48IL3bv5S3Z9Gp4p9nSY.",
            "avatar": null,
            "online": false,
            "date": "2022-02-06T17:12:42.697Z",
            "__v": 0
        }
    ],
    initial: async ()=> {
        try{
            await User.deleteMany();
            await User.insertMany(UsersSeeders.data)
            console.log('USERS : Data Imported');
        }catch(e){
            console.error(e.message)
            process.exit(1)
        }
    },
    destroy: async ()=> {
        try {
            await User.deleteMany();
            console.log('USERS : Data Destroyed');
        } catch (err) {
            console.log(err);
            process.exit();
        }
    }
}

export {UsersSeeders}
