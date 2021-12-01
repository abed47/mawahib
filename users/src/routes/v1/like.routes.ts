import { Router } from "express";
import { dislike, filter, like } from "../../controllers/v1/likesController";
import { verifyJwtToken } from "../../middlewares/authmiddleware";

const router = Router();

router.post('/', verifyJwtToken, like);
router.delete('/', verifyJwtToken, dislike);
router.post('/search', filter);

export default router;