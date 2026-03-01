import ShopSlot from "./shop-slot.model.js";

export const getAllShopSlots = async () => {
    return await ShopSlot.find()
        .populate("category")
        .populate("shop");
};

