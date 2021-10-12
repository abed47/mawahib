import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { returnErrResponse } from '../utils';

//apply environment variables
dotenv.config();

export const verifyJwtToken = (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if(token == null) return returnErrResponse(res, 'token not sent by user', 401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return returnErrResponse(res, 'Authorization Error', 401);
        req['user'] = user;
        if(user) next();
    });
}