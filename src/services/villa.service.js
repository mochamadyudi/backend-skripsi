import {Villa} from "../models/villa/villa.schema";
import YuyuidError from "@yuyuid/exception";
import {makeIdRandom} from "@yuyuid/utils";

export default class VillaService {

    static async createVilla(payload){
        try{
            const villa = new Villa({
                ...payload,
                user: payload.user,
                slug:makeIdRandom(10),
                facility:{
                    ac:false,
                    tv:false,
                    hall: false,
                    gazebo: false,
                    wifi:false,
                    swimming_pool:false,
                    parking:false,
                    meeting_room:false,
                }
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
