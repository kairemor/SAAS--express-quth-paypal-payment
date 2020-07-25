import {
  Router
} from "express";
import {
  signupController,
  signinController,
  signUpValidationController,
  passwordResetController,
  passwordResetConfirmationController
} from "../controllers/authController";
import {
  signinAuth,
  verifyToken
} from "../middlewares/authMiddleware";
import {
  checkSubscription
} from '../middlewares/paymentMiddleware';
import {
  verifyAdmin
} from "../lib/authenticate";

const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.get("/validate", verifyToken, signUpValidationController);
authRouter.post("/signin", signinAuth, signinController);
authRouter.post("/reset-password", passwordResetController);
authRouter.put("/reset-password", verifyToken, passwordResetConfirmationController)
authRouter.post("/admin/signin", signinAuth, verifyAdmin, signinController);

export default authRouter;