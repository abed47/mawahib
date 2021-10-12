import { Response } from "express"

export const returnErrResponse = (res: Response, message: string, code: number, req?: any) => {

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