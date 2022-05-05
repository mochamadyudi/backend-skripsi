import { Router } from 'express';
import BodyResponse from "../../../../lib/handler/body-response";
import { PermissionsValidator } from "../../../../lib/validator";
import { PermissionsService } from "../../../../services/permissions.service";

const cloudinary = require('cloudinary').v2;

const route = Router();

export default (app => {
    app.use('/permissions', route);

    route.post('/roles/create', PermissionsValidator.RolesValidator, async (req, res, next) => {
        try {
            const newRoles = await PermissionsService.Create(req.body);
            return res.status(200).json(newRoles);
        } catch (err) {
            return res.status(500).json(new BodyResponse({
                error: true,
                message: err.message
            }));
        }
    });
    route.get('/roles/', async (req, res, next) => {
        return res.json({ error: false, message: "Berhasil" });
    });
});
//# sourceMappingURL=index.js.map