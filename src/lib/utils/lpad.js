export default class Lpad{
    constructor(props = {}) {
        this.length = props?.length ?? 5
        this.schema = props?.schema ?? undefined
    }

    async get(){
        try{
            if(typeof(this.schema) === undefined) return ''
            const count = await this.schema.count()
            let example = '00000'
            return [example.slice(count.toString().length),count].join("")
        }catch(err){
            return ''
        }

    }
}