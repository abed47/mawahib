import { Response } from "express"

export const returnErrResponse = (res: Response, message: string, code: number, req = null) => {

    if(req){
        return res.status(code).json({
            status: false,
            type: 'error',
            data: null,
            message,
            request: {...req}
        })
    }
    res.status(code).json({
        status: false,
        type: 'error',
        data: null,
        message
    })
}

export const errorResponse: (res: Response, code: number, message: string) => void = (res, code, message) => {
    return res.status(code).json({
        status: false,
        type: 'error',
        data: null,
        message
    })
}

export const successResponse: (res: Response, code: number, message: string, data: any, type?: string) => void = (res, code, message, data, type = 'success') => {
    res.status(code).json({
        status: true,
        type,
        data,
        message
    })
}