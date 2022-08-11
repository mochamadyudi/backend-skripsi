import express from 'express'
import cors from "cors"
import routes from "./api";
import { YuyuidConfig } from "./config";
import bodyParser from 'body-parser'
import connectDB from "../config/db";
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT || YuyuidConfig.port || 5000;

(async()=> {
    await connectDB()
})()

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.urlencoded({extended: true}))

app.use(express.json({extended: false}))

app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
})

app.use(YuyuidConfig.apiPrefix, routes)
app.use('/', (req,res)=> {
    return res.json({message:"OK!"}).status(200)
})
app.listen(PORT, ()=> console.log(`Server is running on : ${PORT}`))
