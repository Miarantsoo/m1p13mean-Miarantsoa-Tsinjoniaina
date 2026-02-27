const Promotion = require('./promotion.model.js');
const Product = require('../products/product.model.js');

exports.createPromotion = async (promotionData) => {
    const product = await Product.findById(promotionData.product);
    if (!product) {
        throw new Error('Produit non trouvé');
    }

    const existingPromotion = await Promotion.findOne({
        product: promotionData.product,
        isActive: true,
        startDate: { $lte: new Date(promotionData.endDate) },
        endDate: { $gte: new Date(promotionData.startDate) }
    });

    if (existingPromotion) {
        throw new Error('Une promotion existe déjà pour ce produit sur cette période');
    }

    const promotion = new Promotion(promotionData);
    await promotion.save();

    return await promotion.populate([
        { path: 'product', select: 'name price photo' },
        { path: 'shop', select: 'name' }
    ]);
};

exports.getPromotionsByShop = async (shopId, filters = {}) => {
    const { isActive, productId, page = 1, limit = 10 } = filters;

    const query = { shop: shopId };

    if (isActive !== undefined) {
        query.isActive = isActive;
        if (isActive) {
            const now = new Date();
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
        }
    }

    if (productId) {
        query.product = productId;
    }

    const skip = (page - 1) * limit;

    const promotions = await Promotion.find(query)
        .populate('product', 'name price photo')
        .populate('shop', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Promotion.countDocuments(query);

    return {
        promotions,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

exports.getPromotionById = async (promotionId) => {
    const promotion = await Promotion.findById(promotionId)
        .populate('product', 'name price photo')
        .populate('shop', 'name');

    if (!promotion) {
        throw new Error('Promotion non trouvée');
    }

    return promotion;
};

exports.updatePromotion = async (promotionId, updateData) => {
    const promotion = await Promotion.findById(promotionId);

    if (!promotion) {
        throw new Error('Promotion non trouvée');
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(
        promotionId,
        updateData,
        { new: true, runValidators: true }
    ).populate([
        { path: 'product', select: 'name price photo' },
        { path: 'shop', select: 'name' }
    ]);

    return updatedPromotion;
};

exports.deletePromotion = async (promotionId) => {
    const promotion = await Promotion.findById(promotionId);

    if (!promotion) {
        throw new Error('Promotion non trouvée');
    }

    await Promotion.findByIdAndDelete(promotionId);

    return { message: 'Promotion supprimée avec succès' };
};

exports.getActivePromotionForProduct = async (productId) => {
    const now = new Date();

    const promotion = await Promotion.findOne({
        product: productId,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
    }).populate('product', 'name price');

    return promotion;
};