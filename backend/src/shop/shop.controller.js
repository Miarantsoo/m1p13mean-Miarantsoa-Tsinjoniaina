import { findAllActiveShops, findShopById } from "./shop.service.js";

export const getAllShops = async (req, res) => {
  try {
    const shops = await findAllActiveShops();
    res.json({ success: true, data: shops });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const getShopById = async (req, res) => {
  try {
    const shop = await findShopById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Boutique introuvable" });
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

