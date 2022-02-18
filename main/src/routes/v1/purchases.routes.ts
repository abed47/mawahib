import { Router } from "express";
import * as controller from '../../controllers/v1/purchases.controller';
import { verifyJwtToken } from "../../middlewares/authmiddleware";

const router = Router();

router.get('/wallet-info', verifyJwtToken, controller.getWalletInfo);
router.get('/checkout', controller.createCheckoutPage);
export default router;