import {Villa} from "../models/villa/villa.schema";
import YuyuidError from "@yuyuid/exception";

export default class VillaService {

    static async createVilla(payload){
        try{
            const villa = new Villa({
                ...payload,
                user: payload?.user
            });
            await villa.save()
            return villa;
        }catch(err){
            return {
                error: true,
                message: err.message,
                data: null,
            }
        }
    }
}
