import { Router } from "express";
import {getDashboardData} from "@/admin/dashboard/dashboard.controller.js";

const router = Router();

router.get("/", getDashboardData);

export default router;