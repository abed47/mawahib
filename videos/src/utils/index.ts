import { Response } from "express"

export const returnErrResponse = (res: Response, message: string, code: number) => {
    res.status(code).json({
        status: false,
        type: 'error',
        data: null,
        message
    })
}