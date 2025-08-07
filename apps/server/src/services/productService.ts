import { Product, IProduct } from '../models/Product';
import { Category } from '../models/Category';
import { AppError } from '../utils/AppError';   

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
  isActive?: boolean;
}

export interface ProductResponse {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ProductService {
  static async getProducts(query: ProductQuery): Promise<ProductResponse> {
    const {
      page = 1,
      limit = 12,
      category,
      featured,
      minPrice,
      maxPrice,
      sizes,
      colors,
      search,
      sort = '-createdAt',
      isActive = true
    } = query;

    // Build filter object
    const filter: any = { isActive };

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (sizes && sizes.length > 0) {
      filter.sizes = { $in: sizes };
    }

    if (colors && colors.length > 0) {
      filter['colors.name'] = { $in: colors };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limit);

    return {
      products: products as IProduct[],
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  }

  static async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  static async getProductById(id: string): Promise<IProduct> {
    const product = await Product.findById(id)
      .populate('category', 'name slug');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  static async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    // Check if category exists
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    // Check if SKU already exists
    if (data.sku) {
      const existingProduct = await Product.findOne({ sku: data.sku });
      if (existingProduct) {
        throw new AppError('Product with this SKU already exists', 400);
      }
    }

    // Check if slug already exists
    if (data.slug) {
      const existingProduct = await Product.findOne({ slug: data.slug });
      if (existingProduct) {
        throw new AppError('Product with this slug already exists', 400);
      }
    }

    const product = await Product.create(data);
    return product.populate('category', 'name slug');
  }

  static async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct> {
    // Check if category exists
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    // Check if SKU already exists (excluding current product)
    if (data.sku) {
      const existingProduct = await Product.findOne({ 
        sku: data.sku, 
        _id: { $ne: id } 
      });
      if (existingProduct) {
        throw new AppError('Product with this SKU already exists', 400);
      }
    }

    // Check if slug already exists (excluding current product)
    if (data.slug) {
      const existingProduct = await Product.findOne({ 
        slug: data.slug, 
        _id: { $ne: id } 
      });
      if (existingProduct) {
        throw new AppError('Product with this slug already exists', 400);
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  static async deleteProduct(id: string): Promise<void> {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
  }

  static async getFeaturedProducts(limit: number = 8): Promise<IProduct[]> {
    return Product.find({ featured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(limit)
      .sort('-createdAt');
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<IProduct[]> {
    return Product.find({
      _id: { $ne: productId },
      category: categoryId,
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(limit)
      .sort('-createdAt');
  }
}