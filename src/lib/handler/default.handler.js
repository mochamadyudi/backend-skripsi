import Boom from '@hapi/boom'
import BodyResponse from "./body-response";

const ValidationError = (err) => {
    const message = err?.message ?? err
    const error = Boom.badRequest(message)
    error.reformat()
    error.output.payload.code = error.output.payload.code ?? err?.code ?? 'ERR_VALIDATION'
    error.output.payload.error = err.error ?? error.output.payload.error ?? 'Bad Request'
    if (typeof (error?.message) === 'string') {
        error.message = `${error?.message}`.replace(/"/g, '')
    }

    return {
        code: error.output.payload?.code ?? 'ERR_VALIDATION',
        error: true,
        message: error?.message ?? null
    }
}

const Conflict = (message) => {
    const error = Boom.conflict(message)
    error.reformat()
    error.output.payload.code = 'ERR_CONFLICT'
    error.output.payload.error = 'error conflict'
    if (typeof (error?.message) === 'string') {
        error.message = `${error?.message}`.replace(/"/g, '')
    }

    return error?.output?.payload
}

const _NotFound = (res, {message = 'Error: data notfound'})=> {
    let error = Boom.notFound(message,{ statusCode:404})
    error.reformat()
    error = error.output.payload
    res.status(404)
    return res.json(new BodyResponse({
        ...error,
        code: 'ERR_NOT_FOUND',
        error: true,
        message: message ?? '',
        data: null
    }))
}
const notFound = (message = 'Data') => {
    let error = Boom.notFound(message,{ statusCode:404})
    error.reformat()
    error = error.output.payload

    return new BodyResponse({
        ...error,
        code: 'ERR_NOT_FOUND',
        error: true,
        message: error?.message ?? '',
        data: null
    })
}
const ExceptionsError = (res, err) => {
    let error = Boom.badImplementation(err?.message)
    error.reformat()
    error = error.output.payload


    res.status(error?.statusCode ?? 500)
    return res.json(new BodyResponse({
        ...error,
        code: 'ERR_EXCEPTIONS',
        error: true,
        message: error?.message ?? '',
        data: null
    }))}

const BadReq = (res, err) => {
    let error = Boom.badRequest(err?.message)
    error.reformat()
    error = error.output.payload
    error.error = true
    error.code = err?.code ?? "ERR_BAD_REQUEST"
    res.status(err?.statusCode ?? error?.statusCode ?? 400)
    delete error.statusCode
    // console.log({error,err})
    return res.json(new BodyResponse({
        ...error,
        message: error?.message ?? '',
        data: null
    }))
}

const SuccessCreate = (res, { message = 'Ok', data = {} }) => {
    res.status(201)
    return res.json({ message })
}

const Success = (res, { message = 'Successfully', data = {} }) => {
    res.status(200)
    return res.json(new BodyResponse({
        code:"SUCCESS",
        error: false,
        message,
        data
    }))
}

const SuccessGetList = (res, { message = 'Successfully get list', data = {} }) => {
    res.status(200)
    return res.json(new BodyResponse({
        code: 'SUCCESS_GET_LIST',
        error: false,
        message: message ?? '',
        ...data
    }))
}
const YidException = {
    ...Boom,
    Conflict,
    ValidationError,
    notFound,
    _NotFound,
    BadReq,
    ExceptionsError,
    SuccessCreate,
    Success,
    SuccessGetList
}

export { YidException }
