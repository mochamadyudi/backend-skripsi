import LibService from "../../services/lib.service";
import {Villa} from "@yuyuid/models";

export default class VillaService extends LibService {
    constructor(props) {
        super(props)
    }

    async _detailVilla() {
        try {
            let data = await Villa.findOne({
                [this.orderBy ?? "_id"]: this.id
            })
            data
                .populate({
                    path: "likes",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["likes"]
                })
                .populate({
                    path: "discuss",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["discuss"]
                })
                .populate({
                    path: "rates",
                    options: {
                        limit: 10,
                        sort: {date: -1},
                        skip: 0
                    },
                    select: ["rates"]
                })
                .populate("locations.provinces", ["name", "id", 'latitude', 'longitude', 'alt_name'])
                .populate("locations.districts", ["name", "id", 'regency_id', 'latitude', 'longitude', 'alt_name'])
                .populate("locations.sub_districts", ["name", "id", 'district_id', 'latitude', 'longitude'])
                .populate("locations.regencies", ["name", "id", 'province_id', 'latitude', 'longitude', 'alt_name'])

            return [null, data]
        } catch (err) {
            return [err, null]
        }
    }

    async _Transaction(){
        try{

        }catch(err){
            return [ err, null ]
        }
    }
}