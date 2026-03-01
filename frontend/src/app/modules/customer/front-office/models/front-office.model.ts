export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Shop {
  _id: string;
  name: string;
  email?: string;
}

export interface Promotion {
  _id: string;
  product: string;
  shop: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  shortDescription?: string;
  photo?: string;
  stock: number;
  available: boolean;
  shop: Shop | string;
  category?: Category | string;
  promotion?: Promotion;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
