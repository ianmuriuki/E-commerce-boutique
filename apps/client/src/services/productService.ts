import { Product } from '../types';
import api from './api';
export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  featured: boolean;
  images: string[];
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  search?: string;
  sort?: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const productService = {
  async getProducts(query: ProductQuery = {}): Promise<ProductResponse> {
    const params = new URLSearchParams();
    
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<{ success: boolean; data: Product }> {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: CreateProductData): Promise<{ success: boolean; data: Product }> {
    const response = await api.post('/products', data);
    return response.data;
  },

  async getFeaturedProducts(limit: number = 8): Promise<ProductResponse> {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  },

  async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<ProductResponse> {
    const response = await api.get(`/products/${productId}/related/${categoryId}?limit=${limit}`);
    return response.data;
  },
};

export type { Product };
