import { EventEmitter } from "events";

export class YuyuidEmitter {
    static getInstance() {
        if (!this.emitter) this.emitter = new EventEmitter();
        return this.emitter;
    }

    static on(eventName, cb) {
        this.getInstance().on(eventName, cb);
    }

    /**
     * Dispatch Event
     * @param {string} eventName Event name
     * @param  {...any} params Parameters
     */
    static dispatch(eventName, ...params) {
        this.getInstance().emit(eventName, ...params);
    }
}
