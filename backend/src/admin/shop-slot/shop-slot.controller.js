import {createShop, getAllShopSlots} from "./shop-slot.service.js";

export const getShopSlots = async (req, res) => {
    try {
        const shopSlots = await getAllShopSlots();
        res.json(shopSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addShopSlot = async (req, res) => {
    try{
        console.log(req.body);
        const shopSlot = await createShop(req.body);

        res.status(201).json({
            message: "Shop created successfully",
            data: shopSlot
        });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

