import { Request, Response } from "express";
import { returnErrResponse } from "../../utils";
import validator from 'validator';
import { User } from "../../database/models";
import { Op, Model } from "sequelize";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as securePin from 'secure-pin';
import { UserCreatedPublisher } from "../../utils/events/user-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

dotenv.config();

export const login = async (req: Request, res: Response) => {
    let {email, password, username, phone} = req.body;

    if(!password || (!email && !username && !phone)) return returnErrResponse(res, 'all fields are required', 400);
    
    try {
        let user: any = await User.findOne({where: {
            email
        }});

        if(!user) return returnErrResponse(res, 'user not found', 404);

        let passwordCompare = await bcrypt.compare(password, user.password);

        if(passwordCompare){

            delete user.dataValues.password;

            let token = jwt.sign(user.dataValues,process.env.JWT_SECRET);

            return res.status(200).json({
                status: true,
                type: 'success',
                data: {token, user},
                message: 'login successful'
            })
        }

        return returnErrResponse(res, 'wrong password', 401);
    } catch (err) {
        returnErrResponse(res, err.message || err, 500);
    }
}

export const register = async (req: Request, res: Response) => {
    let {email, password, first_name, last_name, dob, username} = req.body;

    //validation layer start
    if(!email || !password || !first_name || !last_name) return returnErrResponse(res, 'all fields are require', 400);
    if(!validator.isEmail(email)) return returnErrResponse(res, 'email not valid', 400);
    if(!validator.isLength(password, {min: 6})) return returnErrResponse(res, 'password too short', 400);

    
    try {
        
        //check for existing users
        let user = await User.findOne({where:{email}});
        if(user) return returnErrResponse(res, 'email already exists', 401);


        //hash password start
        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(password, salt);
        
        let createUserObj = {email, password: hashedPass, first_name: first_name, last_name: last_name}
        if(dob) createUserObj['dob'] = dob;
        if(username) createUserObj['username'] = username;
        console.log(createUserObj);
        let createdUser: any = await User.create({...createUserObj});

        new UserCreatedPublisher(natsWrapper.client).publish(createdUser.dataValues);

        res.status(200).json({
            status: true,
            type: 'success',
            data: {email, first_name, last_name, dob},
            message: 'registration successful'
        });

    } catch (err) {
        return returnErrResponse(res, err.message || err, 500);
    }
}

export const requestOtp = async (req: Request, res: Response) => {
    let {userId, type} = req.body;
    
    //validation start
    if(!userId || !type) return returnErrResponse(res, 'all fields are required', 400);

    try {
        let user:any = await User.findOne({where:{id: userId}});
        
        if(!user) return returnErrResponse(res, 'user not found', 404);

        let pin = securePin.generatePinSync(5);
        user.otp = 12345//pin;
        await user.save();

        // if(type == 'email'){
        //     let email = user.email;
        //     if(!email) return returnErrResponse(res, 'user does not have an email', 400);
        //     //send with email logic            
        // }

        // if(type == 'phone'){
        //     let phone = user.phone;
        //     if(!phone) return returnErrResponse(res, 'user does not have a mobile phone', 400);
        //     //send with phone logic
        // }

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'otp set successfully'
        });

    } catch (err) {
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const verifyOtp = async (req: Request, res: Response) => {

    try{
        let {user_id, otp} = req.body;

        if(!user_id || !otp) return returnErrResponse(res, 'all fields are required', 400);

        let user:any = await User.findOne({where: {id: user_id}});

        if(!user) return returnErrResponse(res, 'user not found', 404);

        if(user.otp != otp) return returnErrResponse(res, 'wrong otp', 401);

        user.otp = null;
        user.verified = 1;
        await user.save();

        res.status(200).json({
            status: true,
            type: "success",
            data: user,
            message: 'verified successfully'
        });
    }catch(err){
        returnErrResponse(res, err.message || 'Server Error', 500);
    }
}