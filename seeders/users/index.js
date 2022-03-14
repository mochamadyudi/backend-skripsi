import {User} from '@yuyuid/models'

const UsersSeeders = {
    data: [
        {
            "_id": "6200018a3f2b1398169b0673",
            "role": "admin",
            "email": "admin1@gmail.com",
            "firstName": "admin",
            "lastName": "1",
            "username": "admin",
            "password": "$2a$10$r48IL3bv5S3Z9Gp4p9nSY.mnRg3bNF5.fuZDFbfLyBcQ2vcMLOIEK",
            "salt": "$2a$10$r48IL3bv5S3Z9Gp4p9nSY.",
            "avatar": null,
            "online": false,
            "date": "2022-02-06T17:12:42.697Z",
            "__v": 0
        },
        {
            "_id": "620002c00af04e192356d30c",
            "role": "villa",
            "email": "villaku@gmail.com",
            "firstName": "villaku",
            "lastName": "1",
            "username": "villaku",
            "password": "$2a$10$GTqlAHulvK.u//gC3LidouRo7AyDdLKi28oE9p.ivB7DUYJeuwoA2",
            "salt": "$2a$10$GTqlAHulvK.u//gC3Lidou",
            "avatar": null,
            "online": false,
            "date": "2022-02-06T17:17:52.005Z",
            "__v": 0
        },
        {
            "_id": "620039921065a1ff238b21d5",
            "role": "villa",
            "email": "user@gmail.com",
            "firstName": "user1",
            "lastName": "2",
            "username": "user1",
            "password": "$2a$10$vqSPeVYBtjFifrfq935e3.KRJVRkMRAhm1xU796/iUWMg9kgKYkOC",
            "salt": "$2a$10$vqSPeVYBtjFifrfq935e3.",
            "avatar": null,
            "online": false,
            "date": "2022-02-06T21:11:46.055Z",
            "__v": 0
        },
        {
            "_id": "62003a033724bf4a844869dc",
            "role": "admin",
            "email": "admin12@gmail.com",
            "firstName": "admin2",
            "lastName": "2",
            "username": "admin12",
            "password": "$2a$10$AuW8hBooMGfNBWErthlG5eEsIiXwURdl1VjFwp2GcKv730wYy0eOG",
            "salt": "$2a$10$AuW8hBooMGfNBWErthlG5e",
            "avatar": null,
            "online": false,
            "date": "2022-02-06T21:13:39.903Z",
            "__v": 0
        },
        {
            "_id": "62003a44faa6161e2748309d",
            "role": "admin",
            "email": "admin3@gmail.com",
            "firstName": "admin3",
            "lastName": "2",
            "username": "admin3",
            "password": "$2a$10$qSFR219Ee8s9iEn5ufoQr.8kxQHklHAATgcQXFkf2pv17D8iyMqym",
            "salt": "$2a$10$qSFR219Ee8s9iEn5ufoQr.",
            "avatar": null,
            "online": false,
            "date": "2022-02-06T21:14:44.040Z",
            "__v": 0
        },
        {
            "_id": "62003ac0718c2ca9f990d983",
            "role": "admin",
            "email": "admin4@gmail.com",
            "firstName": "admin4",
            "lastName": "2",
            "username": "admin4",
            "password": "$2a$10$ssDn5RDi2usm3b143nMj9ejynpMN7IG1KQ0DtjwWhhdWXbGQzr2MO",
            "salt": "$2a$10$ssDn5RDi2usm3b143nMj9e",
            "avatar": null,
            "online": false,
            "date": "2022-02-06T21:16:48.355Z",
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