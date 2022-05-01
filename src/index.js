import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import path from 'path'
import routes from "./api";
import { YuyuidConfig } from "./config";
import bodyParser from 'body-parser'
import connectDB from "../config/db";
// import cloudinary from 'cloudinary'
import 'dotenv/config'
// const cloud = cloudinary?.v2
const app = express();
const PORT = process.env.PORT || YuyuidConfig.port || 5000;

connectDB()

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

// cloud.config({
//     cloud_name: 'dra0b73m5',
//     api_key: '353585552788444',
//     api_secret: 'ecZ_vjrYZhgB45cnIocHMfYLLgk',
//     secure: true
// });

app.use('/', (req,res)=> {
    return res.json({message:"OK!"}).status(200)
})
app.use(YuyuidConfig.apiPrefix, routes())

app.listen(PORT, ()=> console.log(`Server is running on : ${PORT}`))
