import { Router } from "express";
import * as categoryController from '../../controllers/v1/categoriesController';
const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.put('/:id', categoryController.updateOne);
router.delete('/:id', categoryController.destroy);
router.post('/', categoryController.create);

export default router;
