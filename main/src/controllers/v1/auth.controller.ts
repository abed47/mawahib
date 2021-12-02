import { Request, Response } from "express";
import { returnErrResponse } from "../../utils";
import validator from 'validator';
import { User } from "../../database/models";
import { Op, Model } from "sequelize";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as securePin from 'secure-pin';
import * as queryString from 'query-string';
import axios from 'axios';
import Twitter from 'node-twitter-api';
import { sendEmail } from "../../utils/communication";
dotenv.config();

export const socialLogin = async (req: Request, res: Response) => {
    let {type} = req.body;

    if(!type) return returnErrResponse(res, 'all fields required', 400);

    if(type == 'facebook') return facebookLogin(req,res);
    if(type == 'twitter') return twitterLogin(req,res);
}

const facebookLogin = async (req: Request, res: Response) => {

    let {token} = req.body;

    if(!token) return returnErrResponse(res, 'token required', 400);

    try{
       let data =  await getFacebookUserData(token);
       
       if(!data || !data?.email) return returnErrResponse(res, 'email is required', 400);

       let user:any = await User.findOne({where: {email: data.email}});

       if(!user){
           user = await User.create({first_name: data.first_name, last_name: data.last_name, email: data.email, password: token});
       }

       delete user.dataValues.password;

       let jwtToken = jwt.sign(user.dataValues,process.env.JWT_SECRET);

       res.status(200).json({
           token: jwtToken,
           status: true,
           type: 'success',
           data: user,
           message: 'login successfully'
       });

    }catch(err){
        return returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

// const getAccessTokenFromCode = async (code) => {
//     const { data } = await axios({
//         url: 'https://graph.facebook.com/v4.0/oauth/access_token',
//         method: 'get',
//         params: {
//             client_id: process.env.FACEBOOK_APP_ID,
//             client_secret: process.env.FACEBOOK_APP_SECRET,
//             code
//         }
//     });

//     return data.access_token;
// }

const getFacebookUserData = async (access_token) => {
    const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
            fields: ['id', 'email', 'first_name', 'last_name'].join(','),
            access_token: access_token
        }
    });

    return data;
}

const twitterLogin = async (req: Request, res: Response) => {
    return res.status(304).json({message: 'under construction'});

    let twitter = new Twitter({
        consumerKey: process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_API_KEY_SECRET
    });

    twitter.getRequestToken((err, requestToken, requestSecret) => {

    })
}

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
    if(!userId) return returnErrResponse(res, 'all fields are required', 400);

    try {
        let user:any = await User.findOne({where:{id: userId}});
        
        if(!user) return returnErrResponse(res, 'user not found', 404);

        let pin = securePin.generatePinSync(5);
        user.otp = pin;
        await user.save();

        let r = await sendEmail(user.email, null, 'Mawahib OTP', `Your OTP is: ${pin}`)

        res.status(200).json({
            status: true,
            type: 'success',
            data: r,
            message: 'otp set successfully'
        });

    } catch (err) {
        console.log(err);
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