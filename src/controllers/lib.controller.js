export default class LibController{
    constructor(props = {}) {
        this.query = props?.query ?? {}
        this.fields = props?.fields ?? {}
        this.req = props?.req ?? undefined
        this.res = props?.res ?? undefined
        this._id = props?._id ?? null
        this.orderBy = props?.orderBy ?? "_id"
    }
}