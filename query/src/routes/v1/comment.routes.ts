import { Router } from "express";
import * as CommentController from '../../controllers/v1/comments.controller';
const router = Router();

router.post('/search', CommentController.filter);

export default router;