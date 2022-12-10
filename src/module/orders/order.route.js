import { Router } from 'express'
const route = Router()

export default ()=> {
    const app = Router()
    app.use('/',route)

    route.get("/:orderId", async (req,res)=> {
        return res.json({message:"OK!"})
    })
    return app
}