const mongoose = require("mongoose");

const Product = require('./product.model.js');

import '../../admin/shop/shop.model.js';
import './category.model.js';

export const getAllProducts = async (filters = {}) => {
    const { shopId, categoryId, available, search, page = 1, limit = 10 } = filters;

    const query = {};

    if (shopId) query.shop = shopId;
    if (categoryId) query.category = categoryId;
    if (available !== undefined) query.available = available;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { shortDescription: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
        .populate('shop', 'name')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Product.countDocuments(query);

    return {
        products,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

export const getProductsByShop = async (shopId, filters = {}) => {
    return await getAllProducts({ ...filters, shopId });
};

export const getProductById = async (productId) => {
    const product = await Product.findById(productId)
        .populate('shop', 'name')
        .populate('category', 'name');

    if (!product) {
        throw new Error('Produit non trouvé');
    }

    return product;
};

export const createProduct = async (productData) => {
    const Shop = require('../../admin/shop/shop.model.js');
    const shopExists = await Shop.findById(productData.shop);

    if (!shopExists) {
        throw new Error('Shop non trouvé');
    }

    if (productData.category) {
        const Category = require('./category.model.js');
        const categoryExists = await Category.findById(productData.category);

        if (!categoryExists) {
            throw new Error('Catégorie non trouvée');
        }
    }

    const product = new Product(productData);
    await product.save();

    return await product.populate([
        { path: 'shop', select: 'name' },
        { path: 'category', select: 'name' }
    ]);
};

export const updateProduct = async (productId, updateData) => {
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
        throw new Error('Produit non trouvé');
    }

    if (updateData.category) {
        const Category = require('./category.model.js');
        const categoryExists = await Category.findById(updateData.category);

        if (!categoryExists) {
            throw new Error('Catégorie non trouvée');
        }
    }

    if (updateData.stock !== undefined) {
        updateData.available = updateData.stock > 0;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).populate([
        { path: 'shop', select: 'name' },
        { path: 'category', select: 'name' }
    ]);

    return updatedProduct;
};

export const deleteProduct = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error('Produit non trouvé');
    }

    await Product.findByIdAndDelete(productId);

    return { message: 'Produit supprimé avec succès' };
};

export const updateProductStock = async (productId, newStock) => {
    if (newStock < 0) {
        throw new Error('Le stock ne peut pas être négatif');
    }

    const product = await Product.findByIdAndUpdate(
        productId,
        {
            stock: newStock,
            available: newStock > 0
        },
        { new: true }
    ).populate([
        { path: 'shop', select: 'name email' },
        { path: 'category', select: 'name' }
    ]);

    if (!product) {
        throw new Error('Produit non trouvé');
    }

    return product;
};

export const getProductStats = async (shopId) => {
    const stats = await Product.aggregate([
        { $match: { shop: mongoose.Types.ObjectId(shopId) } },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                availableProducts: { $sum: { $cond: ['$available', 1, 0] } },
                totalStock: { $sum: '$stock' },
                averagePrice: { $avg: '$price' },
                totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
            }
        }
    ]);

    const categoryStats = await Product.aggregate([
        { $match: { shop: mongoose.Types.ObjectId(shopId) } },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                totalStock: { $sum: '$stock' }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        }
    ]);

    return {
        general: stats[0] || {
            totalProducts: 0,
            availableProducts: 0,
            totalStock: 0,
            averagePrice: 0,
            totalValue: 0
        },
        byCategory: categoryStats
    };
};