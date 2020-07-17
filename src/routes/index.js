import { Router } from "express";
import authRouter from "./authRoute";
import userRoute from "./userRoute";
import {verifyUser} from '../lib/authenticate'

const apiRouter = Router();

apiRouter.use("/api/v1/auth", authRouter);
apiRouter.use("/api/v1/user", verifyUser, userRoute);


export default apiRouter;
