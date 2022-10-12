import LibService from "../../services/lib.service";
import {_MOrder} from "./index";
import Lpad from "../../lib/utils/lpad";

export default class OrderService extends LibService{
    constructor(props) {
        super(props);
        this.schema = _MOrder.Provider
    }

    async create(){
        try{
            let a = new Lpad({schema:this.schema})
            console.log(a)
            return [ null, {test:1}]
        }catch(err){
            return [ err, null ]
        }
    }
}