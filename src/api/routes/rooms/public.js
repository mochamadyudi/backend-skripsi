import {Router} from 'express'
import {BodyResponse} from "@handler";
import RoomsService from "../../../services/rooms.service";
import RoomController from "../../../controllers/room.controller";
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

    route.get("/bed-type", async (req,res)=> {
        res.status(200)
        return res.json({
            data: [
                {
                    name:"single",
                    value:"single"
                },
                {
                    name: "double",
                    value:"double"
                },
                {
                    name: "triple",
                    value: "triple"
                },
                {
                    name: "large",
                    value: "large"
                },
                {
                    name: "Extra Large",
                    value:"extra-large"
                }
            ]
        })
    })

    route.get("/list/:id", new RoomController()._singleRoom)
    route.get('/', new RoomController()._getPublicRooms)
}
