import {YuyuidEmitter} from "@yuyuid/utils";
import {YuyuidEvent} from "@yuyuid/constants";

export default class TmpConfirmRoomsSubscribe{
    constructor(props) {
        YuyuidEmitter.on(YuyuidEvent.tmp.queue.rooms,this.queueRooms)
    }

    async queueRooms(){

    }
}