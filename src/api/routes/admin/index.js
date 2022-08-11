import {Router} from 'express'
import drive from "./drive"
import moment from "moment";
import {VillaPromotion} from "@yuyuid/models";
import {Villa} from "@yuyuid/models";
import permissionsRoute from './permissions/index'
import users from './users'
import villa from './villa'
import travels from './travel'
import {isAdmins} from "../../middlewares/auth";

export default () => {
    const app = Router();
    app.use(isAdmins);
    permissionsRoute(app)
    drive(app)
    users(app)
    villa(app)
    app.use('/travel',travels())

    app.post('/create/promotion/villa', async (req, res) => {
        try {

            const {day, id, type} = req.body

            const fields = {
                villa: id,
                type,
                start_date: moment(Date()).utc(true).day(1).local(),
                end_date: moment(Date()).utc(true).day(Number(day) + 1).local()
            }
            const checked = await VillaPromotion.findOne({villa: id})
            if (!checked) {
                const villaPromotion = new VillaPromotion({
                    ...fields
                })

                await villaPromotion.save();
            }
            const villa = await VillaPromotion.findOne({villa: id}).populate("villa", ["slug", "name", "thumbnail", "bio", "description"])

            return await res.json({
                error: false,
                message: checked ? "This data already exists!": "succeed!\n your villa will appear, please wait a moment",
                data: villa
            })
        } catch (err) {
            return res.json({
                error: true,
                message: err.message,
                data: null
            })
        }
    })
    return app;
}
