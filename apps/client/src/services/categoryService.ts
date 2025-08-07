import api from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCategoryBySlug(slug: string): Promise<{ success: boolean; data: Category }> {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};