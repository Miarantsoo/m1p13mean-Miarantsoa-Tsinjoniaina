const promotionService = require('./promotion.service.js');


exports.createPromotion = async (req, res) => {
    try {
        const promotion = await promotionService.createPromotion(req.body);

        res.status(201).json({
            success: true,
            message: 'Promotion créée avec succès',
            data: promotion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getShopPromotions = async (req, res) => {
    try {
        const { shopId } = req.params;
        const filters = {
            isActive: req.query.isActive,
            productId: req.query.productId,
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };

        const result = await promotionService.getPromotionsByShop(shopId, filters);

        res.status(200).json({
            success: true,
            data: result.promotions,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await promotionService.getPromotionById(id);

        res.status(200).json({
            success: true,
            data: promotion
        });
    } catch (error) {
        const statusCode = error.message === 'Promotion non trouvée' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPromotion = await promotionService.updatePromotion(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Promotion mise à jour avec succès',
            data: updatedPromotion
        });
    } catch (error) {
        const statusCode = error.message === 'Promotion non trouvée' ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await promotionService.deletePromotion(id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        const statusCode = error.message === 'Promotion non trouvée' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProductPromotion = async (req, res) => {
    try {
        const { productId } = req.params;
        const promotion = await promotionService.getActivePromotionForProduct(productId);

        res.status(200).json({
            success: true,
            data: promotion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};