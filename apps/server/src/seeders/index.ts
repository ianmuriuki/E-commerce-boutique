import url from 'url';
import { UriOptions } from 'joi';
import mongoose from 'mongoose';
import { config } from '../config/environment';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

// Sample data
const categories = [
  {
    name: 'Women',
    slug: 'women',
    description: 'Elegant fashion for the modern woman',
    sortOrder: 1
  },
  {
    name: 'Men',
    slug: 'men',
    description: 'Sophisticated style for the discerning gentleman',
    sortOrder: 2
  },
  {
    name: 'Kids',
    slug: 'kids',
    description: 'Luxury fashion for the little ones',
    sortOrder: 3
  }
];

const generateProducts = (categoryId: string, categoryName: string) => {
  const products: any[] = [];
  const baseProducts = {
    women: [
      { title: 'Silk Evening Dress', price: 899, description: 'Luxurious silk evening dress with intricate beadwork' },
      { title: 'Cashmere Blazer', price: 1299, description: 'Premium cashmere blazer with tailored fit' },
      { title: 'Designer Handbag', price: 2199, description: 'Handcrafted leather handbag with gold hardware' },
      { title: 'Pearl Necklace', price: 599, description: 'Elegant freshwater pearl necklace' },
      { title: 'Luxury Scarf', price: 299, description: 'Silk scarf with exclusive print design' }
    ],
    men: [
      { title: 'Italian Wool Suit', price: 2899, description: 'Handtailored Italian wool suit with peak lapels' },
      { title: 'Luxury Watch', price: 4999, description: 'Swiss-made luxury timepiece with automatic movement' },
      { title: 'Leather Oxford Shoes', price: 799, description: 'Handcrafted leather Oxford shoes' },
      { title: 'Cashmere Overcoat', price: 1899, description: 'Premium cashmere overcoat for winter' },
      { title: 'Silk Tie Collection', price: 199, description: 'Set of three premium silk ties' }
    ],
    kids: [
      { title: 'Designer Kids Dress', price: 299, description: 'Adorable designer dress for special occasions' },
      { title: 'Kids Formal Suit', price: 399, description: 'Miniature version of our adult suits' },
      { title: 'Luxury Sneakers', price: 199, description: 'Premium kids sneakers with comfort design' },
      { title: 'Cashmere Sweater', price: 249, description: 'Soft cashmere sweater for kids' },
      { title: 'Designer Backpack', price: 149, description: 'Stylish and functional kids backpack' }
    ]
  };

  const categoryProducts = baseProducts[categoryName.toLowerCase() as keyof typeof baseProducts] || baseProducts.women;
  
  categoryProducts.forEach((product, index) => {
    const slug = product.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
    products.push({
      title: product.title,
      slug: slug,
      description: product.description,
      price: product.price,
      images: [
        'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
        'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg'
      ],
      category: categoryId,
      sizes: categoryName === 'Kids' ? ['2T', '3T', '4T', '5T', '6', '7', '8'] : 
             categoryName === 'Men' ? ['S', 'M', 'L', 'XL', 'XXL'] : 
             ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Midnight Black', hex: '#0D0D0D' },
        { name: 'Champagne Gold', hex: '#C5A880' },
        { name: 'Rich Burgundy', hex: '#6A1B1A' }
      ],
      inStock: Math.floor(Math.random() * 50) + 10,
      sku: `LUX-${categoryName.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
      featured: index < 2, // First 2 products are featured
      tags: ['luxury', 'premium', categoryName.toLowerCase()]
    });
  });

  return products;
};

const adminUser = {
  name: 'Admin User',
  email: 'admin@luxora.com',
  password: 'admin123',
  isAdmin: true,
  emailVerified: true
};

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log('👤 Created admin user');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('📂 Created categories');

    // Create products for each category
    const allProducts = [];
    for (const category of createdCategories) {
      const products = generateProducts(category._id.toString(), category.name);
      allProducts.push(...products);
    }

    await Product.insertMany(allProducts);
    console.log(`📦 Created ${allProducts.length} products`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Seeded data summary:');
    console.log(`   • Admin user: ${adminUser.email} / ${adminUser.password}`);
    console.log(`   • Categories: ${createdCategories.length}`);
    console.log(`   • Products: ${allProducts.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Run seeder if file is executed directly
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}

