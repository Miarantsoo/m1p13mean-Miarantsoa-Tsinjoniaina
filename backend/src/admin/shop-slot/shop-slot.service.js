import ShopSlot from "./shop-slot.model.js";
import User from "@/admin/user/user.model.js";
import ShopRequest from "@/admin/shopRequest/shopRequest.model.js";
import Shop from "@/admin/shop/shop.model.js";

export const getAllShopSlots = async () => {
    return await ShopSlot.find()
        .populate("category")
        .populate("shop");
};

export const createShop = async (data) => {
    console.log(data);

    const user = await User.create({
        first_name: data.manager.first_name,
        last_name: data.manager.last_name,
        email: data.manager.email,
        password: data.manager.password,
        role: data.manager.role,
        phone_number: data.manager.phone_number,
        provider: 'local'
    });

    const shopRequest = await ShopRequest.findById(data.shopRequestId);

    if (!shopRequest) {
        throw new Error('Shop request not found');
    }

    const shop = await Shop.create({
        name: shopRequest.name,
        description: shopRequest.covering_letter,
        logo_url: shopRequest.image_link,
        owner: user._id,
        shop_request: shopRequest._id,
        status: 'active',
        color: data.color
    });

    return await shop;
}

