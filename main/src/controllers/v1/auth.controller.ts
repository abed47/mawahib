import { Request, Response } from "express";
import { errorResponse, returnErrResponse, successResponse } from "../../utils";
import validator from 'validator';
import { User } from "../../database/models";
import { Op, Model } from "sequelize";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as securePin from 'secure-pin';
import * as queryString from 'query-string';
import axios from 'axios';
import Twitter from 'twitter-api-v2';
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../utils/communication";

dotenv.config();

export const socialLogin = async (req: Request, res: Response) => {
    let {type} = req.body;

    if(!type) return returnErrResponse(res, 'all fields required', 400);

    if(type == 'facebook') return facebookLogin(req,res);
    if(type == 'twitter') return twitterLogin(req,res);
    if(type == 'google') return googleLogin(req, res);
    if(type == 'linkedin') return linkedInLogin(req, res);
}

const googleLogin = (req: Request, res: Response) => {

    let { token } = req.body;
    const client = new OAuth2Client(process.env.GCP_APP_ID);

    client.verifyIdToken({
        idToken: token
    }).then(async ticket => {
        let { name, email, picture } = ticket.getPayload();

        try{
            let u: any = await User.findOne({where: {email}});
            if(u){
                let t = jwt.sign(u.dataValues,process.env.JWT_SECRET);
                let r = u.dataValues;
                r.token = t;
                return successResponse(res, 200, 'login successful', r);
            }
            // if(u) return returnErrResponse(res, 'user already exist')
            await User.create({name, email, photo: picture});
            u = await User.findOne({where: { email }});
            let t = jwt.sign(u.dataValues,process.env.JWT_SECRET);
            let r = u.dataValues;
            r.token = t;
            return successResponse(res, 200, 'login successful', r);
        }catch(err){
            return returnErrResponse(res, err?.message || 'server error', 500);
        }


    }).catch(err => {
        return returnErrResponse(res, err?.message || 'google server error', 500);
    })

}

const facebookLogin = async (req: Request, res: Response) => {

    let {token, name, email, profile_pic} = req.body;

    if(!token) return returnErrResponse(res, 'token required', 400);

    try{
    //    let data =  await getFacebookUserData(token);
       
    //    if(!data || !data?.email) return returnErrResponse(res, 'email is required', 400);

       let user:any = await User.findOne({where: {email}});

       if(!user){
           user = await User.create({name, email, photo: profile_pic});
       }

       delete user.dataValues.password;

       let jwtToken = jwt.sign(user.dataValues,process.env.JWT_SECRET);

       let u = {...user.dataValues, token: jwtToken}

       res.status(200).json({
           status: true,
           type: 'success',
           data: u,
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
    console.log({access_token})
    const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
            fields: ['id', 'email', 'name'].join(','),
            access_token: access_token
        }
    });
    return data;
}

const twitterLogin = async (req: Request, res: Response) => {
    // return res.status(304).json({message: 'under construction'});
    try{

        let { token, token_secret } = req.body;

        let twitterClient = new Twitter({
            appKey: process.env.TWITTER_API_KEY, 
            appSecret: process.env.TWITTER_API_KEY_SECRET, 
            accessToken: token, 
            accessSecret: token_secret
        });

        const userData = await twitterClient.v1.verifyCredentials({include_email: true});

        let u = await User.findOne({where: { email: userData.email }});

        if(!u){
            u = await User.create({name: userData.name, email: userData.email, username: userData.screen_name, photo: userData.profile_image_url_https});
        }

        let r = await User.findOne({where: { email: userData.email}});
        
        return successResponse(res, 200, 'login successful', r);

    }catch(err){
        return errorResponse(res, 500, err?.message || err?.error || 'server error');
    }
}

const linkedInLogin = async (req: Request, res: Response) => {
    try{

        let accessTokenResponse = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            queryString.stringify({
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: 'https://localhost:5000/linkedin',
                code: req.body.token
            }),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        let access_token = accessTokenResponse.data.access_token;

        let { data: emailRes }  = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        });
        
        let email = emailRes.elements[0]["handle~"].emailAddress;

        let { data: nameRes } = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        });

        let name = nameRes.localizedFirstName + " " + nameRes.localizedLastName;

        if(!email || !name) return errorResponse(res, 400, 'insuficient data try another way');

        let u = await User.findOne({where: { email }});
        if(!u){
            await User.create({name, email});
        }

        let user:any = await User.findOne({where: { email }});

        let token = jwt.sign(user.dataValues, process.env.JWT_SECRET);
        
        return successResponse(res, 200, 'login successful', {...user.dataValues, token});

    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
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
    let {email, password, name, dob, username, phone, country} = req.body;

    console.log(req.body)
    //validation layer start
    if(!email || !password || !name || !username || !dob) return returnErrResponse(res, 'all fields are require', 400);
    if(!validator.isEmail(email)) return returnErrResponse(res, 'email not valid', 400);
    if(!validator.isLength(password, {min: 6})) return returnErrResponse(res, 'password too short', 400);

    
    try {
        
        //check for existing users
        let user = await User.findOne({where:{[Op.or]: {email, username}}});
        if(user) return returnErrResponse(res, 'user already exists', 401);


        //hash password start
        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(password, salt);
        
        let createUserObj = {email, password: hashedPass, name, dob, phone, country, username}
        if(dob) createUserObj['dob'] = dob;
        if(username) createUserObj['username'] = username;
        let createdUser: any = await User.create({...createUserObj});

        res.status(200).json({
            status: true,
            type: 'success',
            data: {email, name, dob},
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

export const requestPasswordReset = async (req: Request, res: Response) => {
    let {email, type} = req.body;
    
    //validation start
    if(!email) return returnErrResponse(res, 'all fields are required', 400);

    try {
        let user:any = await User.findOne({where:{email}});
        
        if(!user) return returnErrResponse(res, 'user not found', 404);

        let pin = securePin.generatePinSync(5);
        user.otp = pin;
        await user.save();

        let r = await sendEmail(user.email, null, 'Password Reset', `Your Password Reset Code is: ${pin}`)

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

export const resetPassword = async (req: Request, res: Response) => {
    try{
        let {email, otp, password} = req.body;

        if(!email || !otp || !password) return returnErrResponse(res, 'all fields are required', 400);

        let user:any = await User.findOne({where: {email}});

        if(!user) return returnErrResponse(res, 'user not found', 404);

        if(user.otp != otp) return returnErrResponse(res, 'wrong otp', 401);

        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(password, salt);

        user.otp = null;
        // user.verified = 1;
        user.password = hashedPass;
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