import {LocSuggestion} from "@yuyuid/models";
import {Router} from "express";
import axios from "axios";
import {Scraping} from "@yid/controllers";
const route = Router()
export default ()=> {
    const app = Router();
    app.use('/', route)

    route.post('/geo-keo', new Scraping.GeoKeo().create)
    route.post('/hotels4', new Scraping.hotel().create)
    return app

    // LocSuggestion
}
