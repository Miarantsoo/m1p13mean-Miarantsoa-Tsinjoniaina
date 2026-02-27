import { Router } from "express";
import { getShopSlots } from "@/admin/shop-slot/shop-slot.controller.js";

const router = Router();

router.get("/", getShopSlots);

export default router;

