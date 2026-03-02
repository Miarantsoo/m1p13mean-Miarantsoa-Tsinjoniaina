import { Router } from "express";
import {
    placeOrder,
    getMyOrders,
    getShopOrders,
    getAll,
    changeOrderStatus,
    checkPendingOrders
} from './order.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Client
router.post("/", authenticate, placeOrder);
router.get("/my", authenticate, getMyOrders);
router.get("/pending-check", authenticate, checkPendingOrders);

// Shop
router.get("/shop/:shopId", authenticate, authorize('shop'), getShopOrders);
router.patch("/:id/status", authenticate, authorize('shop'), changeOrderStatus);

// Admin
router.get("/", authenticate, authorize('admin'), getAll);

export default router;

