export interface ShopRequest {
  _id: string;
  name: string;
  email: string;
  image_link: string;
}

export interface Planning {
  _id: string;
  shop_request: ShopRequest;
  date: string;
  duration: number;
}
