import {
  Router
} from "express";
import {
  getPlansId,
  paypalSubscription,
  creditCardSubscription
} from '../controllers/paymentController';

const router = Router();

router.get("/plans", getPlansId);
router.post("/paypal", paypalSubscription);
router.post("/credit-card", creditCardSubscription);
// router.get("/success", paymentSuccess)

export default router;