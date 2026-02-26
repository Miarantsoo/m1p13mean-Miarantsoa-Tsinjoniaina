export interface Product {
  _id?: string;
  name: string;
  price: number;
  shortDescription: string;
  photo: string;
  stock: number;
  available: boolean;
  shop: string | Shop;
  category: string | Category;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Shop {
  _id: string;
  name: string;
  email?: string;
  description?: string;
  status?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  shortDescription: string;
  stock: number;
  shop: string;
  category: string;
  photo?: File;
}

export interface ProductResponse {
  success: boolean;
  data: Product | Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  message?: string;
}
