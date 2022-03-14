// import { villa } from '@yuyuid/models'
const {MongoClient} = require('mongodb')
const config = require("config");
const database = MongoClient.connect(config.get("db.detail"))
const upRole = require('./migrations/20220206174702-up-role');


const migrate = async ()=> {
    await upRole.up()
}

migrate()