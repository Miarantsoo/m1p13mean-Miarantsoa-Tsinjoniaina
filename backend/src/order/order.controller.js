import {
    createOrders,
    getOrdersByUser,
    getOrdersByShop,
    getAllOrders,
    updateOrderStatus,
    hasPendingOrders
} from './order.service.js';

const Shop = require('../admin/shop/shop.model.js');

export const placeOrder = async (req, res) => {
    try {
        const { items, pickupDate } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'La commande doit contenir au moins un article.'
            });
        }

        if (!pickupDate) {
            return res.status(400).json({
                success: false,
                message: 'La date de retrait est requise.'
            });
        }

        const orders = await createOrders(req.user.userId, items, pickupDate);

        res.status(201).json({
            success: true,
            data: orders,
            message: `${orders.length} commande(s) créée(s) avec succès.`
        });
    } catch (error) {
        const statusCode = error.message.includes('Stock insuffisant') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await getOrdersByUser(req.user.userId);

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes',
            error: error.message
        });
    }
};

export const getShopOrders = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Vérifier que l'utilisateur est bien le propriétaire du shop
        const shop = await Shop.findById(shopId);
        if (!shop || shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé. Vous n\'êtes pas le propriétaire de cette boutique.'
            });
        }

        const orders = await getOrdersByShop(shopId);

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes',
            error: error.message
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const orders = await getAllOrders();

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes',
            error: error.message
        });
    }
};

export const changeOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'ready', 'picked_up', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Statut invalide. Statuts valides: ${validStatuses.join(', ')}`
            });
        }

        const order = await updateOrderStatus(id, status);

        res.status(200).json({
            success: true,
            data: order,
            message: 'Statut de la commande mis à jour.'
        });
    } catch (error) {
        const statusCode = error.message === 'Commande introuvable.' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const checkPendingOrders = async (req, res) => {
    try {
        const hasPending = await hasPendingOrders(req.user.userId);

        res.status(200).json({
            success: true,
            data: { hasPendingOrders: hasPending }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification des commandes',
            error: error.message
        });
    }
};

