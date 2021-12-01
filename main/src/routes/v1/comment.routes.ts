import { Router } from "express";
import * as commentController from "../../controllers/v1/commentsController";
import { verifyJwtToken } from "../../middlewares/authmiddleware";

const router = Router();

router.post('/', verifyJwtToken, commentController.create);
router.post('/search', commentController.filter);

export default router;