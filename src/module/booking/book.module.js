import BookingService from "./booking.service";

export default class BookModule extends BookingService{
    constructor(props = {}) {
        super(props)
        this.provider = props?.provider ?? undefined
    }

    async _add(){
        try{
            return await this.create()
        }catch(err){
            return [err ,null]
        }
    }
}