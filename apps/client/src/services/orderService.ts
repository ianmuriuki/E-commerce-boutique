import api from './api';

export interface OrderItem {
  product: string;
  quantity: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  notes?: string;
}

export interface OrderStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    user?: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    product: any;
    title: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  async createOrder(data: CreateOrderData): Promise<{ success: boolean; data: Order }> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async getUserOrders(): Promise<{ success: boolean; data: Order[] }> {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<{ success: boolean; data: Order }> {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  async getStats(): Promise<{ success: boolean; data: OrderStats }> {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};