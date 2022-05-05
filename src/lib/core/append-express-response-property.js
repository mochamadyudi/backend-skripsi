
export default class AppendExpressResponseProperty {
    static transformSuccessBody(res,body = {}){
        const message = body.message;
        Reflect.deleteProperty(body,'message');

        const transformedBody = {
            status: res.statusCode,
            success: true,
            message,
            requestTime: new Date().getTime(),
            data: body.data ?body.data : body
        }
        return transformedBody
    }

    static transformErrorBody(res,body){
        const {status,message,error} = body
        const transformedBody = {
            status,
            success: true,
            message,
            error,
            requestTime: new Date().getTime(),
            data: {}
        }
        return transformedBody
    }

    static appendSuccess(req,res,next){
        res.success = res.json
        const old = res.success.bind(res)
        res.success = (body)=> old(this.transformSuccessBody(res,body))
        next()
    }

    static appendError(req,res,next){
        res.success = res.json
        const old = res.success.bind(res)
        res.error = (body)=> old(this.transformSuccessBody(res,body))
        next()
    }
}
