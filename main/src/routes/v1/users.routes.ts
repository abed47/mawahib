import {Router} from 'express';
import { verifyJwtToken } from '../../middlewares/authmiddleware';
import * as userController from '../../controllers/v1/users.controllers';
import * as upload from 'express-fileupload';

let route = Router();

route.get('/:id', verifyJwtToken, userController.getOne);
route.post('/update-user-profile', verifyJwtToken, userController.updateUserProfile);
route.put('/:id', verifyJwtToken,  userController.update);
route.get('/:id/channel', verifyJwtToken, userController.getUserChannel);

export default route;