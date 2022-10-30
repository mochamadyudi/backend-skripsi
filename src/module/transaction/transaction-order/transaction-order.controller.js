export default class TransactionOrderController {
    constructor(props) {
    }

    async get(req,res){
        try{
            res.status(200)
            return res.json({
                status:200,
                error:false,
                message: "Successfully!",
                data: null
            })
        }catch(err){
            res.status(500)
            return res.json({
                ...err,
                status:500,
                error:true,
                message: err?.message ?? "Some Error",
                data: null
            })
        }
    }

}