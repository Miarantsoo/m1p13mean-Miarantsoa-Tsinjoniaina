import Shop from "../admin/shop/shop.model.js";

export const findAllActiveShops = async () => {
  return Shop.find({ status: "active" }).select("-owner -shop_request -__v").sort({ name: 1 });
};

export const findShopById = async (id) => {
  return Shop.findById(id).select("-owner -shop_request -__v");
};

