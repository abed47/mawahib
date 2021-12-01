import { Router } from "express";
import { subscribe, unsubscribe } from "../../controllers/v1/subscriptions.controller";
import { verifyJwtToken } from "../../middlewares/authmiddleware";
let route = Router();

route.post('/channel/subscribe', verifyJwtToken, subscribe);
route.post('/channel/unsubscribe', verifyJwtToken, unsubscribe);

export default route;