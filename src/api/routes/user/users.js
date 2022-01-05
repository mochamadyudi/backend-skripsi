import { Router } from 'express'
const route = Router()


export default (app)=> {
    app.use('/',route)

    route.get('/load', async (req,res,next)=> {
        try{
            console.log(req.header)
            return res.success({ data: { ...req.user } }).status(200);
        }catch(e){
            return next(e)
        }
    })

}
