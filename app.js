import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import path from 'path'
import routes from "./src/api";
import { YuyuidConfig } from "./src/config";
import bodyParser from 'body-parser'
import connectDB from "./config/db";
import 'dotenv/config'
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


// app.use('/', (req,res)=> {
//     return res.json({message:"OK!"}).status(200)
// })
app.use(YuyuidConfig.apiPrefix, routes())

app.use(express.static("client/build"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
app.listen(PORT, ()=> console.log(`Server is running on : ${PORT}`))
