import mongoose from "mongoose";
import Order from '../../order/order.model.js';
import Product from '../products/product.model.js';

export const getShopDashboard = async (req, res) => {
    try {
        const { shopId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            return res.status(400).json({ success: false, message: "ID boutique invalide" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const revenue = await Order.aggregate([
            {
                $match: {
                    shop: new mongoose.Types.ObjectId(shopId),
                    status: 'picked_up',
                    orderDate: { $gte: startOfMonth }
                }
            },
            { $unwind: "$items" }, // Ajout de unwind pour accéder aux items
            {
                $group: {
                    _id: null,
                    monthlyRevenue: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$items.priceAtOrder", 0] }, // Si null, utiliser 0
                                { $ifNull: ["$items.quantity", 0] }      // Si null, utiliser 0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    monthlyRevenue: 1
                }
            }
        ]);

        const dailyRevenueResult = await Order.aggregate([
            {
                $match: {
                    shop: new mongoose.Types.ObjectId(shopId),
                    status: 'picked_up',
                    orderDate: { $gte: today }
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: null,
                    dailyRevenue: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$items.priceAtOrder", 0] },
                                { $ifNull: ["$items.quantity", 0] }
                            ]
                        }
                    }
                }
            }
        ]);

        const monthlyRevenue = revenue[0]?.monthlyRevenue || 0;
        const dailyRevenue = dailyRevenueResult[0]?.dailyRevenue || 0;

        const topProductsGlobal = await Order.aggregate([
            {
                $match: {
                    shop: new mongoose.Types.ObjectId(shopId),
                    status: 'picked_up',
                    orderDate: { $gte: startOfMonth }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantity: { $sum: { $ifNull: ["$items.quantity", 0] } },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$items.priceAtOrder", 0] },
                                { $ifNull: ["$items.quantity", 0] }
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: "$product.name",
                    quantitySold: "$totalQuantity",
                    revenue: "$totalRevenue",
                    category: "$product.category"
                }
            },
            { $sort: { quantitySold: -1 } },
            { $limit: 10 }
        ]);

        const topProductsByCategory = await Order.aggregate([
            {
                $match: {
                    shop: new mongoose.Types.ObjectId(shopId),
                    status: 'picked_up'
                }
            },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: {
                        category: "$product.category",
                        product: "$items.product"
                    },
                    totalQuantity: { $sum: { $ifNull: ["$items.quantity", 0] } },
                    productName: { $first: "$product.name" }
                }
            },
            {
                $group: {
                    _id: "$_id.category",
                    topProducts: {
                        $push: {
                            productId: "$_id.product",
                            name: "$productName",
                            quantitySold: "$totalQuantity"
                        }
                    }
                }
            },
            {
                $project: {
                    categoryId: "$_id",
                    topProducts: {
                        $slice: [
                            {
                                $sortArray: {
                                    input: "$topProducts",
                                    sortBy: { quantitySold: -1 }
                                }
                            },
                            5
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    categoryName: "$category.name",
                    topProducts: 1
                }
            }
        ]);

        return res.json({
            success: true,
            data: {
                revenue: {
                    daily: dailyRevenue,
                    monthly: monthlyRevenue
                },
                topProductsGlobal,
                topProductsByCategory
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};