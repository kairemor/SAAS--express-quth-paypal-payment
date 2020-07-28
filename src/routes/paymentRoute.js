import {
  Router
} from "express";
import {
  getPlansId,
  paypalSubscription,
  creditCardSubscription,
  activationKeyController
} from '../controllers/paymentController';

const router = Router();

router.get("/plans", getPlansId);
router.post("/paypal", paypalSubscription);
router.post("/credit-card", creditCardSubscription);
router.post("/validate-key", activationKeyController);
// router.get("/success", paymentSuccess)

export default router;