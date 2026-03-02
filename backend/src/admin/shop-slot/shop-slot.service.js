import ShopSlot from "./shop-slot.model.js";
import User from "@/admin/user/user.model.js";
import ShopRequest from "@/admin/shopRequest/shopRequest.model.js";
import Shop from "@/admin/shop/shop.model.js";

export const getAllShopSlots = async () => {
    return await ShopSlot.find()
        .populate("category")
        .populate({
            path: "shop",
            populate: { path: "owner", select: "-password" }
        });
};

export const createShop = async (slotId, data) => {
    // Vérifier que le slot existe
    const slot = await ShopSlot.findById(slotId);
    if (!slot) {
        throw new Error('Shop slot not found');
    }
    if (slot.shop) {
        throw new Error('Ce slot est déjà occupé');
    }

    // Vérifier la shop request
    const shopRequest = await ShopRequest.findById(data.shopRequestId);
    if (!shopRequest) {
        throw new Error('Shop request not found');
    }

    // Créer le manager (user)
    const user = await User.create({
        first_name: data.manager.first_name,
        last_name: data.manager.last_name,
        email: data.manager.email,
        password: data.manager.password,
        role: data.manager.role,
        phone_number: data.manager.phone_number,
        provider: 'local'
    });

    // Créer le shop
    const shop = await Shop.create({
        name: shopRequest.name,
        description: shopRequest.covering_letter,
        logo_url: shopRequest.image_link,
        owner: user._id,
        shop_request: shopRequest._id,
        status: 'active',
        color: data.color
    });

    // Mettre à jour le ShopSlot : lier le shop et passer en "occupied"
    slot.shop = shop._id;
    slot.status = 'occupied';
    await slot.save();

    // Mettre à jour la ShopRequest : passer en "approved"
    shopRequest.status = 'approved';
    await shopRequest.save();

    // Retourner le slot peuplé
    return await ShopSlot.findById(slotId)
        .populate("category")
        .populate({
            path: "shop",
            populate: { path: "owner", select: "-password" }
        });
}

