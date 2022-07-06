import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import fs from 'fs'
import path from 'path'
import routes from "./src/api";
import { YuyuidConfig } from "./src/config";
import bodyParser from 'body-parser'
import connectDB from "./config/db";
import 'dotenv/config'
import AppendExpressResponseProperty from "./src/lib/core/append-express-response-property"
import "./src/loaders/events"
import jobLoaders from './src/loaders/jobs'
import { coreMiddleware } from "@yuyuid/core";
import {AuthService} from "@yuyuid/services";
// import AppendExpressResponseProperty from "./src/lib/core/append-express-response-property";

import sharp from 'sharp'

const app = express();
const PORT = process.env.PORT || YuyuidConfig.port || 5000;
// console.log(connectDB.prototype.hasOwnProperty('connected'))
// connectDB()

(async function(){
    await connectDB()
}())

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.urlencoded({extended: false}))

app.use(express.json({extended: false}))

app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
})

jobLoaders();
// AppendExpressResponseProperty()
app.use(AppendExpressResponseProperty.appendSuccess);
app.use(AppendExpressResponseProperty.appendError);

app.get("/public/uploads/:years/:month/:day/:filename", async (req,res,next)=> {
    let paths = path.resolve(__dirname + req.url)
    // await sharp(paths).resize(200,200)
        // .jpeg({quality : 50}).toFile([paths.split(".")[0],"-small",".",paths.split(".")[1]].join(""))
        // .png({quality : 50}).toFile([paths.split(".")[0],"-small",".",paths.split(".")[1]].join(""));
    fs.readFile(paths, (err, data) => {
        if (err) {
            next(err) // Pass errors to Express.
        } else {
            res.sendFile(paths)
        }
    })
})
app.get('/public/uploads/images/:folder/:filename', async(req,res)=> {
    console.log(req.params)
    return res.send('helloooo')
})

app.post('/auth/reset/password/:token',AuthService.ResetPassword)
app.use(YuyuidConfig.apiPrefix,routes())

app.use('/', (req,res)=> {
    return res.json({message:"OK!"}).status(200)
})
//
if(process.env.NODE_ENV === "PRODUCTION"){
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, ()=> console.log(`Server is running on : ${PORT}`))
