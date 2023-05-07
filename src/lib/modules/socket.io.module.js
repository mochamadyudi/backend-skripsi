import session from 'express-session';
import sharedSession from 'express-socket.io-session';
import {isAuth} from "../../api/middlewares/auth";
import jwt from "jsonwebtoken";
import {YuyuidConfig} from "@yuyuid/config";

function _middleware(headers){
    try{
        //Check if there isn't a token
        if(headers.authorization && headers.authorization.split(" ")[0] === "Bearer") {
            const token = headers.authorization.split(" ")[1]
            const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
            // console.log({user})
            if(user){
                return [ null, user]
            }
            return [ new Error("user undefined"),null]
        }else{
            return [ new Error("UnAuthorized"), null]
        }
    }catch(err){
        return [ new Error(err?.message), null]
    }
}
export default class SocketIoModule{
    constructor(server) {
        this.server = server;
        this.user = undefined;
        this.io = require("socket.io")(server,{
            cors: {
                origin: "http://villa.localhost:6001",
                methods: ["GET", "POST"]
            }
        });
        this.headers = {}
        this.sessionMiddleware = session({
            secret: YuyuidConfig.jwtSecret,
            resave: true,
            saveUninitialized: true
        });
        this.getInstance();
    }

    getUserId(headers){
        try{
            //Check if there isn't a token
            if(headers.authorization && headers.authorization.split(" ")[0] === "Bearer") {
                const token = headers.authorization.split(" ")[1]
                const {user} = jwt.verify(token, YuyuidConfig.jwtSecret);
                if(user){
                    return [ null, user]
                }
                return [ new Error("user undefined"),null]
            }else{
                return [ new Error("UnAuthorized"), null]
            }
        }catch(err){
            return [ new Error(err?.message), null]
        }
    }
    getInstance(){
        this.io.use(sharedSession(this.sessionMiddleware,{
            autoSave:true
        }));

        this.io.use((socket,next)=> {
            this.headers = socket.request.headers;
            const [ err, data ] = _middleware(socket.request.headers);
            if(err) next(err);
            next();
        })

        this._connection();
    }


    _connection(){
        const connectedUsers = new Map();

        this.io.on('disconnect', function(){
            console.log('io disconnect')
        })
        this.io.on("connection", (socket,next)=> {
            const [err, user] = this.getUserId(socket.request.headers);
            if(!err && user) connectedUsers.set(user?.id ?? user?._id, socket.id);

            console.log(['A Client has connected',user?.id ?? user?._id].join(" - "));
            socket.on('disconnect', () => {
                connectedUsers.delete(user?.id ?? user?._id);
            });


            socket.on('get-notification', function(){
                let data = []

                data.push({
                    id:1 + data.length,
                    type:1,
                    message:"OK"
                })
                socket.emit("notification",data)
            })

            socket.on("send-notification", function(data){
                const [ err, user ] = _middleware(socket.request.headers);
                if(user){
                    socket.broadcast.emit("notification",[
                        {
                            id:2,
                            type:1,
                            ...data
                        }
                    ]);
                }
            })
        })
    }
}