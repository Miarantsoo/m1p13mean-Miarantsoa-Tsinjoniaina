interface CategoryShop {
  _id: string;
  name: string;
  rent_price: number
}

export interface Shop {
  _id: string;
  name: string;
  description: string;
  logo_url: string;
  owner: string;
  shop_request: string;
  status: string;
  color: string;
}

export interface ShopSlot {
  _id: string;
  glb_node_name: string;
  category: CategoryShop;
  position: {
    x: number,
    y: number,
    z: number
  }
  shop: Shop;
  status: string;
}
