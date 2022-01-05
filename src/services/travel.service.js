import {TravelLikes} from "../models/travel/travel_likes.schema";
import {Travel, TravelDiscuss} from "@yuyuid/models";

export class TravelService {
    static async constructTravel(){}

    static async all(query){
        try{
            console.log(query)
            const page = query.current ? parseInt(query.current) : 1;
            const limit = query.limit ? parseInt(query.limit) : 20;
            const skipIndex = (page - 1) * limit;
            const results = {};
            const travelCount =  await Travel.count()
            const travel = await Travel.find({})
                .sort({ name: "asc",date:-1 })
                .limit(limit)
                .skip(skipIndex)
                .exec();

            const data = {
                total:travelCount,
                total_page: Math.floor(travelCount / limit) + 1,
                page: page,
                limit,
                data: travel
            }

            return [null,data]
        }catch(e){
            return [e,null]
        }
    }

    static async create(query){
        try{
            const {
                travel_name,
                images,
                facility,  //
                lat, // { location }
                long, // { location }
                travel_detail,
                periods,
                price,
            } = query
            const travelFields = {};
            travelFields.travel_name = travel_name;
            travelFields.images = images;
            travelFields.facility = facility;
            travelFields.travel_detail = travel_detail;
            travelFields.location = {}

            if (lat) travelFields.location.lat = lat
            if (long) travelFields.location.long = long
            travelFields.price = {}


            if (price.specials) travelFields.price.specials = price.specials
            if (price.regular ) travelFields.price.regular = price.regular
            if (price.family ) travelFields.price.family = price.family
            if (price.discount ) travelFields.price.discount = price.discount

            travelFields.periods = [];
            if (periods.length > 0){
                travelFields.periods = periods
            }
            const travel = new Travel(travelFields)
            await travel.save()
            return [null,travel]
        }catch(e){
            return [e,null]
        }
    }
    static async update(){}
    static async delete(){}
    static async single(params){
        try{
            const travel = await Travel.findOne({id:params?.id})
            console.log(travel)
            //    const profile = await Profile.findOne({
            //       user: req.params.user_id
            //     }).populate("user", ["name", "avatar"]);
            // return [null, data]
            return [null,travel]
        }catch(err){
            return [err,null]
        }
    }

    static async isExists(){

    }


    /**
     *
     * @returns {Promise<void>}
     */
    static async firstCreatLikes(id){
        try{
            const likes = new TravelLikes({travel:id})
            await likes.save()
            return [null,likes]
        }catch(e){
            return [e,null]
        }
    }
    static async firstCreateDiscuss(id){
        try{
            const discuss = new TravelDiscuss({travel:id})
            await discuss.save()
            return [null,discuss]
        }catch(e){
            return [e,null]
        }
    }


    static async getLikes(id){
        const likes = await TravelLikes.findOne({id:id})
        return likes
    }
    static async getDiscuss(id){
        const discuss = await TravelDiscuss.findOne({id:id})
        return discuss
    }



    static async addLikes(){}
    static async deleteLikes(){}
}