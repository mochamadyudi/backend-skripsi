import VillaSubscribe from "./villa.subscribe";
import VillaController from "./villa.controller";
import VillaService from "./villa.service";
import VillaRoute from "./villa.route";

export const _MVilla = {
    Controller: VillaController,
    Service: VillaService,
    Subscribe: VillaSubscribe,
    Route: {
        v1: VillaRoute,
        v2: VillaRoute
    }
}