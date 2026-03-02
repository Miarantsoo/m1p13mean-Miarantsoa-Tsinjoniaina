import { Router } from "express";
import {addShopSlot, getShopSlots} from "@/admin/shop-slot/shop-slot.controller.js";

const router = Router();

router.get("/", getShopSlots);
router.put("/:id/assign", addShopSlot);

export default router;

