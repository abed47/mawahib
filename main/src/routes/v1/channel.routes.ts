import { Router } from 'express';
import * as channelController from '../../controllers/v1/channels.controller';
import { verifyJwtToken } from '../../middlewares/authmiddleware';

let route = Router();

route.get('/', channelController.getAll);
route.get('/:id', channelController.getOne);
route.post('/', verifyJwtToken, channelController.create);
route.put('/:id', verifyJwtToken, channelController.update);
route.delete('/:id', verifyJwtToken, channelController.destroy);
route.post('/view/:id', channelController.view);
route.post('/search', channelController.filter);

//create middleware to check users
route.post('/get-videos', channelController.getChannelVideos);
route.post('/channel-followers', channelController.getChannelFollowers);
export default route;