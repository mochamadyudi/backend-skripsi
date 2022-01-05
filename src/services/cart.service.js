import {Cart, CartInfo} from "@yuyuid/models";

export class CartService {
    static async AddCountItem(id = null,item_id =null,count = 0){
        if (id !== null && item_id !==null){

        }
    }

    static async FirstAddCart(id = null){
        if (id !== null){
            const cart = new Cart({user:id});
            const cartInfo = new CartInfo({user:id});
            await cartInfo.save();
            await cart.save();
        }
    }

    static async DeleteItemCart(id = null, item_id = null){
        if (id !== null && item_id !== null){

        }
    }

    static async AddItemToCart(id = null, item = {}){
        if (id !== null){

            return null;
        }
    }

}
