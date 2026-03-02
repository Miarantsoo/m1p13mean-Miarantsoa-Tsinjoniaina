import {
    getCartByUser,
    syncCart,
    clearCart
} from './cart.service.js';

export const getCart = async (req, res) => {
    try {
        const cart = await getCartByUser(req.user.userId);

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du panier',
            error: error.message
        });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message: 'Le champ items doit être un tableau.'
            });
        }

        const cart = await syncCart(req.user.userId, items);

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la synchronisation du panier',
            error: error.message
        });
    }
};

export const emptyCart = async (req, res) => {
    try {
        await clearCart(req.user.userId);

        res.status(200).json({
            success: true,
            message: 'Panier vidé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du panier',
            error: error.message
        });
    }
};

