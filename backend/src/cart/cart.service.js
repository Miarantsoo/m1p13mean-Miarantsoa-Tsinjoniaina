import Cart from "./cart.model.js";

// Enregistrer les modèles nécessaires pour les populate
import '../shop/products/product.model.js';
import '../admin/shop/shop.model.js';
import '../shop/products/category.model.js';
import '../shop/promotion/promotion.model.js';

export const getCartByUser = async (userId) => {
    let cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.product",
            populate: [
                { path: "shop", select: "name" },
                { path: "category", select: "name" },
                { path: "promotion" }
            ]
        });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
        await cart.save();
    }

    return cart;
};

export const syncCart = async (userId, items) => {
    return await Cart.findOneAndUpdate(
        { user: userId },
        { user: userId, items },
        { new: true, upsert: true }
    ).populate({
        path: "items.product",
        populate: [
            { path: "shop", select: "name" },
            { path: "category", select: "name" },
            { path: "promotion" }
        ]
    });
};

export const clearCart = async (userId) => {
    return await Cart.findOneAndUpdate(
        { user: userId },
        { items: [] },
        { new: true }
    );
};





