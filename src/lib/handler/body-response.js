export default class BodyResponse{
    constructor(props = {}) {
        return this.getInstance(props)
    }

    getInstance(props){
        try{
            return {
                ...props,
                status: props?.status ?? 200,
                error: props?.error ?? false,
                message: props?.message ?? null,
                data: props?.data ?? null,
            }

        }catch(err){
            return {
                ...props,
                status: props?.status ?? 400,
                error:true,
                message: err.message ?? null,
                data: null,
            }
        }
    }
}
