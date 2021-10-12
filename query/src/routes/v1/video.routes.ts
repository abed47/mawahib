import { Router } from "express";
import { filter } from "../../controllers/v1/video.controller";

const router = Router();

router.post('/search', filter);

export default router;