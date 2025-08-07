export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

export const mockCategories: Category[] = [
  {
    _id: '1',
    name: 'Women',
    description: 'Elegant fashion for the modern woman',
    slug: 'women'
  },
  {
    _id: '2',
    name: 'Men',
    description: 'Sophisticated style for the discerning gentleman',
    slug: 'men'
  },
  {
    _id: '3',
    name: 'Kids',
    description: 'Luxury fashion for the little ones',
    slug: 'kids'
  }
];

export const mockProducts: Product[] = [
  // Women's Products
  {
    _id: '1',
    title: 'Silk Evening Dress',
    slug: 'silk-evening-dress',
    description: 'Luxurious silk evening dress with intricate beadwork and flowing silhouette. Perfect for special occasions.',
    price: 899,
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg'
    ],
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Black', hex: '#0D0D0D' },
      { name: 'Champagne Gold', hex: '#C5A880' },
      { name: 'Rich Burgundy', hex: '#6A1B1A' }
    ],
    inStock: 15,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Cashmere Blazer',
    slug: 'cashmere-blazer',
    description: 'Premium cashmere blazer with tailored fit and gold-tone buttons. A wardrobe essential.',
    price: 1299,
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'
    ],
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory White', hex: '#F7F5F2' },
      { name: 'Midnight Black', hex: '#0D0D0D' },
      { name: 'Camel', hex: '#C19A6B' }
    ],
    inStock: 8,
    featured: true,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    _id: '3',
    title: 'Designer Handbag',
    slug: 'designer-handbag',
    description: 'Handcrafted leather handbag with gold hardware and signature design elements.',
    price: 2199,
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
      'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg'
    ],
    category: 'women',
    sizes: ['One Size'],
    colors: [
      { name: 'Midnight Black', hex: '#0D0D0D' },
      { name: 'Rich Burgundy', hex: '#6A1B1A' },
      { name: 'Cognac Brown', hex: '#8B4513' }
    ],
    inStock: 12,
    featured: false,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  // Men's Products
  {
    _id: '4',
    title: 'Italian Wool Suit',
    slug: 'italian-wool-suit',
    description: 'Handtailored Italian wool suit with peak lapels and modern slim fit. Includes jacket and trousers.',
    price: 2899,
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
      'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg'
    ],
    category: 'men',
    sizes: ['36', '38', '40', '42', '44', '46'],
    colors: [
      { name: 'Midnight Black', hex: '#0D0D0D' },
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Navy Blue', hex: '#1B2951' }
    ],
    inStock: 6,
    featured: true,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    _id: '5',
    title: 'Luxury Watch',
    slug: 'luxury-watch',
    description: 'Swiss-made luxury timepiece with automatic movement and sapphire crystal.',
    price: 4999,
    images: [
      'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg',
      'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg'
    ],
    category: 'men',
    sizes: ['One Size'],
    colors: [
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Rose Gold', hex: '#E8B4B8' }
    ],
    inStock: 3,
    featured: true,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  {
    _id: '6',
    title: 'Leather Oxford Shoes',
    slug: 'leather-oxford-shoes',
    description: 'Handcrafted leather Oxford shoes with Goodyear welt construction and leather sole.',
    price: 799,
    images: [
      'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'
    ],
    category: 'men',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Burgundy', hex: '#6A1B1A' }
    ],
    inStock: 20,
    featured: false,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  // Kids' Products
  {
    _id: '7',
    title: 'Designer Kids Dress',
    slug: 'designer-kids-dress',
    description: 'Adorable designer dress for special occasions with delicate embroidery and comfortable fit.',
    price: 299,
    images: [
      'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
      'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg'
    ],
    category: 'kids',
    sizes: ['2T', '3T', '4T', '5T', '6', '7', '8'],
    colors: [
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#ADD8E6' }
    ],
    inStock: 25,
    featured: true,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    _id: '8',
    title: 'Kids Formal Suit',
    slug: 'kids-formal-suit',
    description: 'Miniature version of our adult suits, perfect for formal events and special occasions.',
    price: 399,
    images: [
      'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
      'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg'
    ],
    category: 'kids',
    sizes: ['2T', '3T', '4T', '5T', '6', '7', '8', '10'],
    colors: [
      { name: 'Navy Blue', hex: '#1B2951' },
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Black', hex: '#000000' }
    ],
    inStock: 15,
    featured: false,
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  }
];

export const mockOrders = [
  {
    _id: '1',
    orderNumber: 'LUX-2024-001',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567'
    },
    items: [
      {
        product: mockProducts[0],
        quantity: 1,
        size: 'M',
        color: 'Midnight Black'
      }
    ],
    total: 899,
    status: 'processing',
    shippingAddress: {
      street: '123 Luxury Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z'
  }
];