import { Router } from "express";
import authRouter from "./authRoute";
import userRoute from "./userRoute";
import groupRouter from './groupRoute';
import adminRouter from "./adminRoute";
import adminAuthRouter from "./adminAuthRoute"

import {verifyUser, verifyAdmin} from '../lib/authenticate'
import { signinAuth } from "../middlewares/authMiddleware";

const apiRouter = Router();

apiRouter.use("/api/v1/auth", authRouter);
apiRouter.use("/api/v1/user", verifyUser, userRoute);
apiRouter.use("/api/v1/group", verifyUser, groupRouter);
apiRouter.use("/admin/auth", adminAuthRouter)
apiRouter.use("/admin", adminRouter)

export default apiRouter;
