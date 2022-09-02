import {TravelCategory} from "../../models/travel/travel_categories.schema.";

export default class TravelCategoryController {
    async delete(id){
        await TravelCategory.findOneAndRemove({_id:id})
    }
}
