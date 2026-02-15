import ShopRequest from "./shopRequest.model.js";

export const getAllShopRequests = async (status) => {
    return await ShopRequest.find({status});
}

export const createShopRequest = async (shopRequestData) => {
    const shopRequest = new ShopRequest(shopRequestData);

    return await shopRequest.save();
};
