import { User } from "../../database/models";
import { Router } from "express";
import * as authController from '../../controllers/v1/auth.controller';
import { verifyJwtToken } from "../../middlewares/authmiddleware";
let route = Router();

route.post('/login', authController.login);
route.post('/register', authController.register);
route.post('/request-otp', authController.requestOtp);

export default route;