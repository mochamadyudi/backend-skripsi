import {Router} from 'express'
import {BodyResponse} from "@handler";
const route = Router()
export default (app)=> {
    app.use("/", route)



    /**
     * @route {{host}}/api/v1/rooms/type
     */
    route.get("/type", async (req, res) => {
        try {
            const example = [
                {
                    id: '1',
                    name: "superior"
                },
                {
                    id: '2',
                    name: "deluxe"
                },
                {
                    id: '3',
                    name: "junior"
                },
                {
                    id: '4',
                    name: "presidential"
                },
                {
                    id: '5',
                    name: "single"
                },
                {
                    id: '6',
                    name: "twin"
                },
                {
                    id: '7',
                    name: "standard"
                },
                {
                    id: '8',
                    name: "suite"
                },
                {
                    id: '9',
                    name: "double"
                },
                {
                    id: '10',
                    name: "triple"
                }
            ]

            return res.json({
                error: false,
                message: "it's example data! not call db",
                data: example
            })
        } catch (err) {
            return res.json(new BodyResponse({
                ...err,
                error: true,
                message: err.message
            }))
        }
    })
}