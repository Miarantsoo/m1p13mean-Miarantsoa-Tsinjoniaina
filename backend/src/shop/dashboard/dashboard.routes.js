import { Router } from "express";
import { authenticate, authorize } from "@/middleware/auth.middleware.js";
import { getShopDashboard } from "@/shop/dashboard/dashboard.controller.js";

const router = Router();

router.get("/:shopId", authenticate, authorize('shop'), getShopDashboard);

export default router;