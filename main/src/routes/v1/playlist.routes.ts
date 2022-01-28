import { Router } from "express";
import * as controller from '../../controllers/v1/playlist.controller';

const router = Router();

router.get('/list', controller.list);
router.get('/:id', controller.getOne);

export default router;