import { Router } from "express";
import * as UtilsController from '../../controllers/v1/utils.controller';
import { verifyJwtToken } from "../../middlewares/authmiddleware";
import * as expressUpload from 'express-fileupload';

let route = Router();

route.get('/seed', UtilsController.seed);
route.post('/upload-image', verifyJwtToken, UtilsController.uploadPhoto).use(expressUpload({createParentPath: true}));
route.get('/home', UtilsController.getHomeData);
route.post('/channel-dashboard', UtilsController.channelDashboard);

export default route;