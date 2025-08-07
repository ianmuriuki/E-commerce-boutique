import { Order, IOrder, IOrderItem } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';   

export interface CreateOrderData {
  items: Array<{
    product: string;
    quantity: number;
    size: string;
    color: string;
  }>;
  shippingAddress: IOrder['shippingAddress'];
  billingAddress?: IOrder['billingAddress'];
  paymentMethod: IOrder['paymentMethod'];
  notes?: string;
  customer?: {
    user?: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  customer?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface OrderResponse {
  orders: IOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class OrderService {
  static async createOrder(data: CreateOrderData): Promise<IOrder> {
    // Validate and process order items
    const processedItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const item of data.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new AppError(`Product not found: ${item.product}`, 404);
      }

      if (!product.isActive) {
        throw new AppError(`Product is not available: ${product.title}`, 400);
      }

      if (product.inStock < item.quantity) {
        throw new AppError(`Insufficient stock for product: ${product.title}`, 400);
      }

      // Validate size and color
      if (!product.sizes.includes(item.size)) {
        throw new AppError(`Invalid size for product: ${product.title}`, 400);
      }

      const colorExists = product.colors.some(color => color.name === item.color);
      if (!colorExists) {
        throw new AppError(`Invalid color for product: ${product.title}`, 400);
      }

      const orderItem: IOrderItem = {
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0]
      };

      processedItems.push(orderItem);
      subtotal += product.price * item.quantity;
    }

    // Calculate totals
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal >= 500 ? 0 : 25; // Free shipping over $500
    const total = subtotal + tax + shipping;

    // Create order
    const orderData: Partial<IOrder> = {
      customer: data.customer
        ? {
            ...data.customer,
            user: data.customer.user ? new (require('mongoose').Types.ObjectId)(data.customer.user) : undefined
          }
        : {
            name: `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
            email: data.shippingAddress.email,
            phone: data.shippingAddress.phone
          },
      items: processedItems,
      subtotal,
      tax,
      shipping,
      discount: 0,
      total,
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      notes: data.notes
    };

    const order = await Order.create(orderData);

    // Update product stock
    for (const item of data.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { inStock: -item.quantity } }
      );
    }

    return order.populate('items.product', 'title slug images');
  }

  static async getOrders(query: OrderQuery): Promise<OrderResponse> {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      customer,
      startDate,
      endDate
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (customer) {
      filter.$or = [
        { 'customer.email': { $regex: customer, $options: 'i' } },
        { 'customer.name': { $regex: customer, $options: 'i' } },
        { orderNumber: { $regex: customer, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'title slug images')
        .populate('customer.user', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limit);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  static async getOrderById(id: string): Promise<IOrder> {
    const order = await Order.findById(id)
      .populate('items.product', 'title slug images')
      .populate('customer.user', 'name email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  static async getOrderByNumber(orderNumber: string): Promise<IOrder> {
    const order = await Order.findOne({ orderNumber })
      .populate('items.product', 'title slug images')
      .populate('customer.user', 'name email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  static async updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product', 'title slug images');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  static async updatePaymentStatus(id: string, paymentStatus: IOrder['paymentStatus'], paymentId?: string): Promise<IOrder> {
    const updateData: any = { paymentStatus };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.product', 'title slug images');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  static async getUserOrders(userId: string, query: Omit<OrderQuery, 'customer'>): Promise<OrderResponse> {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate
    } = query;

    // Build filter object
    const filter: any = { 'customer.user': userId };

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'title slug images')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limit);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  static async getOrderStats() {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0
    };
  }
}