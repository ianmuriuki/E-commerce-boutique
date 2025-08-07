import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils';
import Button from '../ui/Button';
import Card from '../ui/Card';

const CartDrawer: React.FC = () => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    total, 
    itemCount, 
    updateQuantity, 
    removeItem 
  } = useCart();

  const generateCartItemId = (productId: string, size: string, color: string): string => {
    return `${productId}-${size}-${color}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="font-serif text-xl font-semibold text-luxury-black">
                  Shopping Cart ({itemCount})
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="font-semibold text-lg text-gray-600 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add some luxury items to get started
                    </p>
                    <Button onClick={closeCart}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => {
                      const itemId = generateCartItemId(
                        item.product._id,
                        item.size,
                        item.color
                      );

                      return (
                        <Card key={itemId} className="p-4">
                          <div className="flex space-x-4">
                            {/* Product Image */}
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-luxury-black truncate">
                                {item.product.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Size: {item.size} • Color: {item.color}
                              </p>
                              <p className="font-semibold text-luxury-gold mt-2">
                                {formatCurrency(item.product.price)}
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(itemId)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-luxury-gold">{formatCurrency(total)}</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button fullWidth size="lg">
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={closeCart}
                    >
                      Continue Shopping
                    </Button>
                  </div>

                  {/* Security Badge */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      🔒 Secure checkout with SSL encryption
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;