import {UpRolePermissions} from "@yuyuid/models";

const UpRolePermissionsSeeder = {
    data: [
        {
            "_id": "62003a033724bf4a844869e7",
            "__v": 0,
            "date": "2022-02-06T21:13:39.952Z",
            "is_deleted": false,
            "role": "6200340083c1ba4d60e00fbe",
            "updated_at": "2022-02-06T21:13:39.952Z",
            "user": "62003a033724bf4a844869dc"
        },
        {
            "_id":  "62003a44faa6161e274830a8",
            "__v": 0,
            "date":  "2022-02-06T21:14:44.102Z",
            "is_deleted": false,
            "role":  "6200340083c1ba4d60e00fbe",
            "updated_at":  "2022-02-06T21:14:44.102Z",
            "user":  "62003a44faa6161e2748309d"
        },
        {
            "_id":  "62003ac0718c2ca9f990d98e",
            "__v": 0,
            "date":  "2022-02-06T21:16:48.407Z",
            "is_deleted": false,
            "role":  "6200340083c1ba4d60e00fbe",
            "updated_at":  "2022-02-06T21:16:48.407Z",
            "user":  "62003ac0718c2ca9f990d983"
        }
    ],
    initial: async ()=> {
        try{
            await UpRolePermissions.deleteMany();
            await UpRolePermissions.insertMany(UpRolePermissionsSeeder.data)
            console.log('UP_ROLE_PERMISSIONS : Data Imported');
        }catch(e){
            console.error(e.message)
            process.exit(1)
        }
    },
    destroy: async ()=> {
        try {
            await UpRolePermissions.deleteMany();
            console.log('UP_ROLE_PERMISSIONS : Data Destroyed');
        } catch (err) {
            console.log(err);
            process.exit();
        }
    }
}
export {UpRolePermissionsSeeder}