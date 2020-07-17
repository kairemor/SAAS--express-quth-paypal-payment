import { Router } from "express";
import {
  signupController,
  signinController,
  signUpValidationController,
} from "../controllers/authController";
import { signinAuth, verifyToken } from "../middlewares/authMiddleware";


const authRouter = Router();
authRouter.post("/signup", signupController);
authRouter.get("/validate", verifyToken, signUpValidationController);
authRouter.post("/signin", signinAuth, signinController);

export default authRouter;
