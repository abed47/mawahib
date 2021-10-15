import { Router } from "express";
import { filter, getRelated } from "../../controllers/v1/video.controller";

const router = Router();

router.post('/search', filter);
router.post('/related', getRelated);

export default router;