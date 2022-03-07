import { Router } from "express";
import * as controller from '../../controllers/v1/event.controller';
import {verifyJwtToken} from "../../middlewares/authmiddleware";

const router = Router();

router.post('/home', controller.home);
router.post('/subscribe', verifyJwtToken, controller.subscribe);
router.post('/unsubscribe', verifyJwtToken, controller.unsubscribe);
router.post('/view/:id', controller.view);
router.post('/participate', controller.participate);

export default router;