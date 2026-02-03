import ShopRequest from "./shopRequest.model.js";

export const getAllShopRequests = async () => {
    return await ShopRequest.find();
}

export const createShopRequest = async (shopRequestData) => {
    const shopRequest = new ShopRequest(shopRequestData);

    return await shopRequest.save();
};
