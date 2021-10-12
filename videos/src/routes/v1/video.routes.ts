import { Router } from "express";
import * as videoController from '../../controllers/v1/videosController';
let route = Router();

route.post('/upload', videoController.create);
route.post('/search', videoController.filter);

export default route;