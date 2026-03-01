import Order from "./order.model.js";
import Cart from "../cart/cart.model.js";

const Product = require('../shop/products/product.model.js');
const Shop = require('../admin/shop/shop.model.js');

import '../shop/products/category.model.js';
import '../shop/promotion/promotion.model.js';

export const createOrders = async (userId, items, pickupDate) => {
    // Vérifier la date de retrait (max J+10)
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);

    const pickup = new Date(pickupDate);
    if (pickup < now || pickup > maxDate) {
        throw new Error("La date de retrait doit être comprise entre aujourd'hui et J+10.");
    }

    // Récupérer les produits avec leur shop
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } })
        .populate('shop', 'name')
        .populate('promotion');

    // Vérifier que tous les produits existent
    if (products.length !== productIds.length) {
        throw new Error("Certains produits n'existent plus.");
    }

    // Vérifier le stock et construire les items par shop
    const itemsByShop = {};

    for (const item of items) {
        const product = products.find(p => p._id.toString() === item.productId);

        if (!product) {
            throw new Error(`Produit ${item.productId} introuvable.`);
        }

        if (product.stock < item.quantity) {
            throw new Error(`Stock insuffisant pour "${product.name}". Stock disponible: ${product.stock}`);
        }

        // Calculer le prix au moment de la commande (avec promo éventuelle)
        let priceAtOrder = product.price;
        if (product.promotion) {
            const discount = product.promotion.discountType === 'percentage'
                ? (priceAtOrder * product.promotion.discountValue) / 100
                : product.promotion.discountValue;
            priceAtOrder = priceAtOrder - discount;
        }

        const shopId = product.shop._id.toString();
        if (!itemsByShop[shopId]) {
            itemsByShop[shopId] = [];
        }

        itemsByShop[shopId].push({
            product: product._id,
            quantity: item.quantity,
            priceAtOrder
        });
    }

    // Créer une commande par shop
    const orders = [];
    for (const [shopId, shopItems] of Object.entries(itemsByShop)) {
        const order = new Order({
            user: userId,
            shop: shopId,
            items: shopItems,
            pickupDate: pickup,
            status: 'pending',
            orderDate: new Date()
        });
        await order.save();
        orders.push(order);
    }

    // Décrémenter le stock de chaque produit
    for (const item of items) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
        );
    }

    // Vider le panier en DB
    await Cart.findOneAndUpdate(
        { user: userId },
        { items: [] }
    );

    // Peupler les commandes pour le retour
    const populatedOrders = await Order.find({
        _id: { $in: orders.map(o => o._id) }
    })
        .populate('shop', 'name')
        .populate('items.product', 'name price photo');

    return populatedOrders;
};

export const getOrdersByUser = async (userId) => {
    return await Order.find({ user: userId })
        .populate('shop', 'name')
        .populate('items.product', 'name price photo')
        .sort({ orderDate: -1 });
};

export const getOrdersByShop = async (shopId) => {
    return await Order.find({ shop: shopId })
        .populate('user', 'first_name last_name email')
        .populate('items.product', 'name price photo')
        .sort({ orderDate: -1 });
};

export const getAllOrders = async () => {
    return await Order.find()
        .populate('user', 'first_name last_name email')
        .populate('shop', 'name')
        .populate('items.product', 'name price photo')
        .sort({ orderDate: -1 });
};

export const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Commande introuvable.");
    }

    order.status = status;
    await order.save();

    return await Order.findById(orderId)
        .populate('user', 'first_name last_name email')
        .populate('shop', 'name')
        .populate('items.product', 'name price photo');
};

export const hasPendingOrders = async (userId) => {
    const count = await Order.countDocuments({
        user: userId,
        status: { $in: ['pending', 'ready'] }
    });
    return count > 0;
};



