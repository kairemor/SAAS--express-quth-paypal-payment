import { Router } from "express";
import { getAllGroupController, getGroupByIdController, createGroupController} from '../controllers/groupController'

const router = Router();

router.get("/", getAllGroupController);
router.get("/:id", getGroupByIdController);
router.post("/", createGroupController);


export default router;
