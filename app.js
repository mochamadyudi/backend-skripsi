import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import fs from 'fs'
import path from 'path'
import routes from "./src/api";
import RoutesV2 from './src/api/v2/index'
import { YuyuidConfig } from "./src/config";
import bodyParser from 'body-parser'
import connectDB from "./config/db";
import 'dotenv/config'
import AppendExpressResponseProperty from "./src/lib/core/append-express-response-property"
import "./src/loaders/events"
import jobLoaders from './src/loaders/jobs'
import {AuthService} from "@yuyuid/services";

const app = express();
const PORT = process.env.PORT || YuyuidConfig.port || 5000;

(async function(){
    await connectDB()
}())

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.urlencoded({extended: true}))

app.use(express.json({extended: true}))

app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
})

jobLoaders();

app.get("/public/uploads/:years/:month/:day/:filename", async (req,res,next)=> {
    let paths = path.resolve(__dirname + req.url)
    fs.readFile(paths, (err, data) => {
        if (err) {
            next(err) // Pass errors to Express.
        } else {
            res.sendFile(paths)
        }
    })
})

app.post('/auth/reset/password/:token',AuthService.ResetPassword)
app.use(YuyuidConfig.apiPrefix,routes())
app.use('/api/v2',RoutesV2())
if(process.env.NODE_ENV === "PRODUCTION"){
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, ()=> console.log(`Server is running on : ${PORT}`))
