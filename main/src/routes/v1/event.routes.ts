import { Router } from "express";
import * as controller from '../../controllers/v1/event.controller';

const router = Router();

router.post('/home', controller.home);

export default router;