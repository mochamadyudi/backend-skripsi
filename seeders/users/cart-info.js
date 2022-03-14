import {CartInfo} from "@yuyuid/models";

const CartInfoSeeders = {
    data: [
        {
            "_id": "6200018a3f2b1398169b0678",
            "user": "6200018a3f2b1398169b0673",
            "is_open": true,
            "date": "2022-02-06T17:12:42.730Z",
            "__v": 0
        },
        {
            "_id": "620002c00af04e192356d311",
            "user": "620002c00af04e192356d30c",
            "is_open": true,
            "date": "2022-02-06T17:17:52.021Z",
            "__v": 0
        },
        {
            "_id": "620002d90af04e192356d31c",
            "user": "620002d90af04e192356d317",
            "is_open": true,
            "date": "2022-02-06T17:18:17.063Z",
            "__v": 0
        },
        {
            "_id": "62003590634201a717ac6510",
            "user": "62003590634201a717ac650b",
            "is_open": true,
            "date": "2022-02-06T20:54:40.686Z",
            "__v": 0
        },
        {
            "_id": "620035c9b971ccad9dc0a7fb",
            "user": "620035c9b971ccad9dc0a7f6",
            "is_open": true,
            "date": "2022-02-06T20:55:37.750Z",
            "__v": 0
        },
        {
            "_id": "620036464fe61d521abceaad",
            "user": "620036464fe61d521abceaa8",
            "is_open": true,
            "date": "2022-02-06T20:57:42.694Z",
            "__v": 0
        },
        {
            "_id": "620036b9e157a72f4e54e107",
            "user": "620036b9e157a72f4e54e102",
            "is_open": true,
            "date": "2022-02-06T20:59:37.962Z",
            "__v": 0
        },
        {
            "_id": "62003730f60e5202dfed14e1",
            "user": "62003730f60e5202dfed14dc",
            "is_open": true,
            "date": "2022-02-06T21:01:36.415Z",
            "__v": 0
        },
        {
            "_id": "6200373e0273d95f90b4b83b",
            "user": "6200373e0273d95f90b4b836",
            "is_open": true,
            "date": "2022-02-06T21:01:50.960Z",
            "__v": 0
        },
        {
            "_id": "620037870a8a79889adf49fd",
            "user": "620037870a8a79889adf49f8",
            "is_open": true,
            "date": "2022-02-06T21:03:03.439Z",
            "__v": 0
        },
        {
            "_id": "6200397064b5381c6c200d3c",
            "user": "6200397064b5381c6c200d37",
            "is_open": true,
            "date": "2022-02-06T21:11:12.294Z",
            "__v": 0
        },
        {
            "_id": "620039921065a1ff238b21da",
            "user": "620039921065a1ff238b21d5",
            "is_open": true,
            "date": "2022-02-06T21:11:46.086Z",
            "__v": 0
        },
        {
            "_id": "62003a033724bf4a844869e1",
            "user": "62003a033724bf4a844869dc",
            "is_open": true,
            "date": "2022-02-06T21:13:39.929Z",
            "__v": 0
        },
        {
            "_id": "62003a44faa6161e274830a2",
            "user": "62003a44faa6161e2748309d",
            "is_open": true,
            "date": "2022-02-06T21:14:44.072Z",
            "__v": 0
        },
        {
            "_id": "62003ac0718c2ca9f990d988",
            "user": "62003ac0718c2ca9f990d983",
            "is_open": true,
            "date": "2022-02-06T21:16:48.383Z",
            "__v": 0
        }
    ],
    initial: async ()=> {
        try{
            await CartInfo.deleteMany();
            await CartInfo.insertMany(CartInfoSeeders.data)
            console.log('CART_INFO : Data Imported');
        }catch(e){
            console.error(e.message)
            process.exit(1)
        }
    },
    destroy: async ()=> {
        try {
            await CartInfo.deleteMany();
            console.log('CART_INFO : Data Destroyed');
        } catch (err) {
            console.log(err);
            process.exit();
        }
    }
}

export {CartInfoSeeders}