import LibController from "../lib.controller";
import HotelsController from "./hotels.controller";
import GeoKeoController from "./GeoKeo.controller";
const Scraping = {
    hotel: HotelsController,
    GeoKeo: GeoKeoController
}
export default Scraping