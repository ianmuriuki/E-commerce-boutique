import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, Truck, Calendar, DollarSign } from 'lucide-react';
import { orderService, Order } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-luxury-black mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">
            Track and manage your luxury fashion orders
          </p>
        </div>

        {error && (
          <Card className="p-6 mb-8 bg-red-50 border border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-gray-600 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here
            </p>
            <Button>
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="p-3 bg-luxury-gold/10 rounded-full">
                        <Package className="w-6 h-6 text-luxury-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-luxury-black">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex space-x-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-luxury-black truncate">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Size: {item.size} • Color: {item.color}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>
                          Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Payment: {order.paymentStatus}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;