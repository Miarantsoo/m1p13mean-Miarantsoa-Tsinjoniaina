import { Router } from "express";
import {getDashboardData} from "@/admin/dashboard/dashboard.controller.js";
import {authenticate, authorize} from "@/middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, authorize('admin'), getDashboardData);

export default router;