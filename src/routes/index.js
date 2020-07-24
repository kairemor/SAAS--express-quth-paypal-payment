import {
  Router
} from "express";
import authRouter from "./authRoute";
import userRoute from "./userRoute";
import groupRouter from './groupRoute';
import adminRouter from "./adminRoute";
import paymentRouter from "./paymentRoute";
import adminAuthRouter from "./adminAuthRoute"

import {
  createAgreementController,
  processAgreement
} from "../controllers/paypalController"
import {
  verifyUser
} from '../lib/authenticate'

const apiRouter = Router();

apiRouter.use("/api/v1/auth", authRouter);
apiRouter.use("/api/v1/user", verifyUser, userRoute);
apiRouter.use("/api/v1/group", verifyUser, groupRouter);
apiRouter.use("/api/v1/payment", verifyUser, paymentRouter);
apiRouter.use("/admin/auth", adminAuthRouter)
apiRouter.use("/admin", adminRouter)
apiRouter.get("/", createAgreementController)
apiRouter.get("/processagreement", processAgreement)

export default apiRouter;