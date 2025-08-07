import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils';
import { useCart } from '../../contexts/CartContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add with default size and color
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0].name;

    // Convert product to expected shape with category as string
    const productForCart = {
      ...product,
      category: typeof product.category === 'string' ? product.category : product.category.slug,
    };

    addItem(productForCart, defaultSize, defaultColor, 1);
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <Card hover glass className="group overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/90 rounded-full text-luxury-black hover:bg-white transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-3 bg-luxury-gold rounded-full text-luxury-black hover:bg-luxury-gold-dark transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-luxury-gold text-luxury-black px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            </div>
          )}

          {/* Stock Badge */}
          {product.inStock < 5 && product.inStock > 0 && (
            <div className="absolute top-4 right-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Only {product.inStock} left
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="mb-2">
            <h3 className="font-serif text-lg font-semibold text-luxury-black group-hover:text-luxury-gold transition-colors">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Colors */}
          <div className="flex space-x-2 mb-4">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 self-center">
                +{product.colors.length - 4} more
              </span>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xl text-luxury-black">
              {formatCurrency(product.price)}
            </span>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Add to Cart
            </Button>
          </div>

          {/* Sizes */}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.sizes.slice(0, 5).map((size, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;