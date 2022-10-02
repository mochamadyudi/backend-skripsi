import axios from "axios";
import {LocSuggestion} from "@yuyuid/models";

export default class GeoKeoController{
    async create(req,res){
        try{
            let {q} = req.body
            let api = process.env.GEO_KEO_API_KEY || "772c41cc65a40ca26dd4938a591f2b9f"
            let params = {
                api:process.env.GEO_KEO_API_KEY || "772c41cc65a40ca26dd4938a591f2b9f",

            }
            let newdata = []
            console.log({q})
            if(Array.isArray(q) && q.length > 0){
                for(let i = 0; i < q.length;i++){
                    await axios.get('https://geokeo.com/geocode/v1/search.php', {
                        params:{
                            q:q[i],
                            api
                        }
                    })
                        .then(async (response)=> {
                            // console.log({data:response?.data?.results})
                            if(typeof(response?.status) !== "undefined" && response?.status === 200){
                                if(typeof(response?.data?.results) !== 'undefined' && Array.isArray(response?.data?.results)){
                                    let results = response?.data?.results ?? []

                                    for(let i = 0; i < results?.length;i++){
                                        const getList = await LocSuggestion.find({
                                            'address_components.name:':results[i].address_components.name,
                                            'address_components.island:':results[i].address_components.island,
                                            'address_components.district:':results[i].address_components.district,
                                            'address_components.state:':results[i].address_components.state,
                                            'address_components.postcode:':results[i].address_components.postcode,
                                            'address_components.country:':results[i].address_components.country,
                                            'formatted_address':results[i].formatted_address,
                                        })
                                        if (Array.isArray(getList) && getList.length === 0){
                                            const locSuggest = await  new LocSuggestion({
                                                ...results[i]
                                            })
                                            newdata.push({
                                                ...results[i]
                                            })
                                            await locSuggest.save()
                                        }
                                    }
                                }
                            }
                            console.log({response})
                        })
                        .catch((err)=> {
                            return res.json({
                                error:true,
                                message: err.message
                            }).status(500)
                        })
                }
            }
            return res.json({
                error:false,
                data: newdata,
                message: "Success!"
            }).status(200)

        }catch(err){
            return res.json({
                error:true,
                message: err.message
            }).status(500)
        }
    }
}