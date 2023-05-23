import {BookingSchema} from "../../models/booking/booking.schema";
import LibService from "../../services/lib.service";
import * as http from "http";
import express from "express";
import io from 'socket.io';

export default class NotificationsService{
    /**
     *
     * @param {http.createServer} server
     * @param {Object} args
     * @param {Function} args.callback
     * @param {Array|Object|String|null|undefined} args.request
     */
    constructor(
        server,
        args
    ) {
        let socket = require("socket.io")(server);

        this.io = socket;
        this.socket = undefined;
        this.callback = args?.callback ?? undefined
        this.request = args?.request ?? undefined

        // console.log(this);
        this.io.on("connection", (sc)=> {
            console.log('A client has connected',sc);
            this.socket = sc;
            this._checked();
            this._getNotification();
            this._emit();

        })
    }

    /**
     * @private
     */
    _checked(){
        if(typeof(this.socket) === 'undefined') throw new Error("this.socket must be defined");}

    /**
     * @private
     */
    _emit(){
        this.socket.on("setNotification",this.request)

    }

    /**
     * @private
     */
    _getNotification(){
        this.socket.on("getNotification", this.callback)
    }
}