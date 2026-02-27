import { Router } from "express";
import {
    getProducts,
    getShopProducts,
    getProduct,
    addProduct,
    updateProductController,
    deleteProductController,
    updateStock,
    getStats, getCategories
} from './product.controller.js';
import { upload } from "../../config/multer.js";

const router = Router();

router.get("/categories", getCategories);

// Routes générales
router.get("/", getProducts);
router.post("/", upload.single('photo'), addProduct);

// Routes par shop
router.get("/shop/:shopId", getShopProducts);
router.get("/shop/:shopId/stats", getStats);

// Routes par ID
router.get("/:id", getProduct);
router.put("/:id", upload.single('photo'), updateProductController);
router.patch("/:id/stock", updateStock);
router.delete("/:id", deleteProductController);

export default router;