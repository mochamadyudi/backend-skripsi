module.exports = {
  async up(db, client) {
    await db.collection('up_role_permissions').updateOne({role: {type:Number,default:1},slug:"super-admin"});
    await db.collection('up_role_permissions').updateOne({role: {type:Number,default:1},slug:"admin"});
    await db.collection('up_role_permissions').updateOne({role: {type:Number,default:1},slug:"villa"});
    await db.collection('up_role_permissions').updateOne({role: {type:Number,default:1},slug:"customer"});
    await db.collection('up_role_permissions').updateOne({role: {type:Number,default:1},slug:"guest"});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('up_role_permissions').updateMany(
    //     {}, {$rename: {roles: "role"}});
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('up_role_permissions').updateOne({role: 1,slug:"super-admin"});
        await db.collection('up_role_permissions').updateOne({role: 2,slug:"admin"});
        await db.collection('up_role_permissions').updateOne({role: 3,slug:"villa"});
        await db.collection('up_role_permissions').updateOne({role: 4,slug:"customer"});
        await db.collection('up_role_permissions').updateOne({role: 5,slug:"guest"});
      });
    } finally {
      await session.endSession();
    }
  }
};
