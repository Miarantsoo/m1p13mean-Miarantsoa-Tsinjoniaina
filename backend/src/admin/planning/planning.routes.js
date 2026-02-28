import { Router } from "express";
import {createPlanning, getPlannings} from "@/admin/planning/planning.controller.js";

const router = Router();

router.get("/", getPlannings);
router.post("/", createPlanning);

export default router;