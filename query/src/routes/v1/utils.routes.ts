import { Router } from "express";
import * as UtilsController from '../../controllers/v1/utils.controller';
import { verifyJwtToken } from "../../middlewares/authmiddleware";
let route = Router();

route.get('/seed', UtilsController.seed);
route.post('/upload-image', verifyJwtToken, UtilsController.uploadPhoto);

export default route;