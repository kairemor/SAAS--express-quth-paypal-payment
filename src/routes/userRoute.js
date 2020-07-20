import { Router } from "express";
import { getAllUsers, updateUser, getUserByPk  } from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserByPk);
router.put("/:id", updateUser);

export default router;
