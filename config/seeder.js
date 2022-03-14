
import {
    CartInfoSeeders,
    CartSeeders,
    ProfileSeeders,
    UpRolePermissionsSeeder,
    upRoleSeeder,
    UsersSeeders
} from '../seeders/index';

import connectDB from './db'

connectDB();

const SeederDestroyed= async()=> {
    await upRoleSeeder.destroy();
    await UsersSeeders.destroy();
    await ProfileSeeders.destroy();
    await CartSeeders.destroy();
    await CartInfoSeeders.destroy();
    await UpRolePermissionsSeeder.destroy();
    process.exit()
}
const SeederImported = async ()=> {
    await upRoleSeeder.initial();
    await UsersSeeders.initial();
    await ProfileSeeders.initial();
    await CartSeeders.initial();
    await CartInfoSeeders.initial();
    await UpRolePermissionsSeeder.initial();
    process.exit();
}

switch (process.argv[2]) {
    case '--d': {
        SeederDestroyed()
        break;
    }
    default: {
        SeederImported()
    }
}