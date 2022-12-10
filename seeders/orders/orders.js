import {OrderSchema} from "../../src/models/order/order.schema";


export const OrderSeeder = {
    initial: async ()=> {

    },
    destroy: async ()=> {
        try{
            await OrderSchema.deleteMany();
            console.log('Order: Data Destroyed');
            await OrderIn
        }catch(err){
            console.log(err);
            console.log('Failed Destroy order collections')
            process.exit();
        }
    }
}