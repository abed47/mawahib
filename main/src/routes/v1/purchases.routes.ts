import { Router } from "express";
import * as controller from '../../controllers/v1/purchases.controller';
import { verifyJwtToken } from "../../middlewares/authmiddleware";

const router = Router();

router.get('/wallet-info', verifyJwtToken, controller.getWalletInfo);
router.get('/product-list', controller.productListing);
router.get('/product/:id', controller.getProduct);
router.get('/checkout', controller.createCheckoutPage);
router.post('/payment-intent', controller.createPaymentIntent);
router.post('/confirm-payment', controller.confirmPayment);
router.get('/transaction-history', verifyJwtToken, controller.getTransactionHistory);

export default router;