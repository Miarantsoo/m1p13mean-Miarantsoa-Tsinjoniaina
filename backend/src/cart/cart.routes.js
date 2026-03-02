import { Router } from "express";
import { getCart, updateCart, emptyCart } from './cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get("/", authenticate, getCart);
router.put("/", authenticate, updateCart);
router.delete("/", authenticate, emptyCart);

export default router;

