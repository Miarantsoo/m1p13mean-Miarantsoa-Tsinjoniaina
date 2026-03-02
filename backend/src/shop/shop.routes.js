import { Router } from "express";
import { getAllShops, getShopById } from "./shop.controller.js";

const router = Router();

router.get("/", getAllShops);
router.get("/:id", getShopById);

export default router;

