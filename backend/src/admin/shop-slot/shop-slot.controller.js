import { getAllShopSlots } from "./shop-slot.service.js";

export const getShopSlots = async (req, res) => {
    try {
        const shopSlots = await getAllShopSlots();
        res.json(shopSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

