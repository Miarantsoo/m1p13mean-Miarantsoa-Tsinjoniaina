import { Router } from "express";
import { getUsers, addUsers } from "./user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", addUsers);
export default router;