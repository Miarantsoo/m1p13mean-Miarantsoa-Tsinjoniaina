import Shop from '../shop/shop.model.js';
import User from '../user/user.model.js';

export const getDashboardData = async (req, res) => {
    try {
        const activeShopsCount = await Shop.countDocuments({ status: "active" });
        const totalClients = await User.countDocuments({ role: "customer" });
        const shops = await Shop.find({ status: "active" });
        res.json({
            totalShops: activeShopsCount,
            totalClients: totalClients,
            shps: shops
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}