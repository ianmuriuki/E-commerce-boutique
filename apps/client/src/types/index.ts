export interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: {
    toLowerCase(): unknown;
    _id: string;
    name: string;
    slug: string;
  };
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: number;
  sku: string;
  featured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}