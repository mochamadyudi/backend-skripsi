import {Cart} from "@yuyuid/models";

const CartSeeders = {
    data: [
        {
            "_id": "6200018a3f2b1398169b0677",
            "user": "6200018a3f2b1398169b0673",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T17:12:42.729Z",
            "__v": 0
        },
        {
            "_id": "620002c00af04e192356d310",
            "user": "620002c00af04e192356d30c",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T17:17:52.019Z",
            "__v": 0
        },
        {
            "_id": "620002d90af04e192356d31b",
            "user": "620002d90af04e192356d317",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T17:18:17.063Z",
            "__v": 0
        },
        {
            "_id": "62003590634201a717ac650f",
            "user": "62003590634201a717ac650b",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T20:54:40.685Z",
            "__v": 0
        },
        {
            "_id": "620035c9b971ccad9dc0a7fa",
            "user": "620035c9b971ccad9dc0a7f6",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T20:55:37.750Z",
            "__v": 0
        },
        {
            "_id": "620036464fe61d521abceaac",
            "user": "620036464fe61d521abceaa8",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T20:57:42.693Z",
            "__v": 0
        },
        {
            "_id": "620036b9e157a72f4e54e106",
            "user": "620036b9e157a72f4e54e102",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T20:59:37.961Z",
            "__v": 0
        },
        {
            "_id": "62003730f60e5202dfed14e0",
            "user": "62003730f60e5202dfed14dc",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:01:36.415Z",
            "__v": 0
        },
        {
            "_id": "6200373e0273d95f90b4b83a",
            "user": "6200373e0273d95f90b4b836",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:01:50.960Z",
            "__v": 0
        },
        {
            "_id": "620037870a8a79889adf49fc",
            "user": "620037870a8a79889adf49f8",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:03:03.439Z",
            "__v": 0
        },
        {
            "_id": "6200397064b5381c6c200d3b",
            "user": "6200397064b5381c6c200d37",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:11:12.294Z",
            "__v": 0
        },
        {
            "_id": "620039921065a1ff238b21d9",
            "user": "620039921065a1ff238b21d5",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:11:46.086Z",
            "__v": 0
        },
        {
            "_id": "62003a033724bf4a844869e0",
            "user": "62003a033724bf4a844869dc",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:13:39.929Z",
            "__v": 0
        },
        {
            "_id": "62003a44faa6161e274830a1",
            "user": "62003a44faa6161e2748309d",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:14:44.071Z",
            "__v": 0
        },
        {
            "_id": "62003ac0718c2ca9f990d987",
            "user": "62003ac0718c2ca9f990d983",
            "rooms": [],
            "travels": [],
            "date": "2022-02-06T21:16:48.383Z",
            "__v": 0
        }
    ],
    initial: async ()=> {
        try{
            await Cart.deleteMany();
            await Cart.insertMany(CartSeeders.data)
            console.log('CART : Data Imported');
        }catch(e){
            console.error(e.message)
            process.exit(1)
        }
    },
    destroy: async ()=> {
        try {
            await Cart.deleteMany();
            console.log('CART : Data Destroyed');
        } catch (err) {
            console.log(err);
            process.exit();
        }
    }
}

export {CartSeeders}