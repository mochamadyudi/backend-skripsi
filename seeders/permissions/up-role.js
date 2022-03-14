import {UpRole} from '@yuyuid/models'

const upRoleSeeder = {
    data:[
        {
            role:1,
            slug:"super-admin",
            is_deleted:false,
            updated_at:Date.now(),
            date:Date.now(),
        },
        {
            role:2,
            slug:"admin",
            is_deleted:false,
            updated_at:Date.now(),
            date:Date.now(),
        },
        {
            role:3,
            slug:"villa",
            is_deleted:false,
            updated_at:Date.now(),
            date:Date.now(),
        },
        {
            role:4,
            slug:"customer",
            is_deleted:false,
            updated_at:Date.now(),
            date:Date.now(),
        },
        {
            role:5,
            slug:"guest",
            is_deleted:false,
            updated_at:Date.now(),
            date:Date.now(),
        },

    ],
    initial:async()=>{
        try{
            await UpRole.deleteMany();
            await UpRole.insertMany(upRoleSeeder.data)
            console.log('UP_ROLE : Data Imported');
        }catch(e){
            console.error(e.message)
            process.exit(1)
        }

    },
    destroy:async()=> {
        try {
            await UpRole.deleteMany();
            console.log('UP_ROLE : Data Destroyed');

        } catch (err) {
            console.log(err);
            process.exit();
        }
    }
}

export {upRoleSeeder}