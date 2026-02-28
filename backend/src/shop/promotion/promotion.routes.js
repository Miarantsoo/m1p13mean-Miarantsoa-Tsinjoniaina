const express = require('express');
const router = express.Router();
const promotionController = require('./promotion.controller.js');

router.post("/", promotionController.createPromotion);
router.get("/shop/:shopId", promotionController.getShopPromotions);
router.get("/product/:productId", promotionController.getProductPromotion);
router.get("/:id", promotionController.getPromotion);
router.put("/:id", promotionController.updatePromotion);
router.delete("/:id", promotionController.deletePromotion);

module.exports = router;