import mongoose, { Document, Schema } from 'mongoose';

export interface IColor {
  name: string;
  hex: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  sizes: string[];
  colors: IColor[];
  inStock: number;
  sku: string;
  featured: boolean;
  isActive: boolean;
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const colorSchema = new Schema<IColor>({
  name: {
    type: String,
    required: [true, 'Color name is required'],
    trim: true
  },
  hex: {
    type: String,
    required: [true, 'Color hex code is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code']
  }
}, { _id: false });

const dimensionsSchema = new Schema({
  length: { type: Number, required: true, min: 0 },
  width: { type: Number, required: true, min: 0 },
  height: { type: Number, required: true, min: 0 }
}, { _id: false });

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
    validate: {
      validator: function(this: IProduct, value: number) {
        return !value || value > this.price;
      },
      message: 'Compare price must be greater than regular price'
    }
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: {
      validator: function(images: string[]) {
        return images.length > 0 && images.length <= 10;
      },
      message: 'Product must have between 1 and 10 images'
    }
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  sizes: {
    type: [String],
    required: [true, 'At least one size is required'],
    validate: {
      validator: function(sizes: string[]) {
        return sizes.length > 0;
      },
      message: 'Product must have at least one size'
    }
  },
  colors: {
    type: [colorSchema],
    required: [true, 'At least one color is required'],
    validate: {
      validator: function(colors: IColor[]) {
        return colors.length > 0;
      },
      message: 'Product must have at least one color'
    }
  },
  inStock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    default: []
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    type: dimensionsSchema,
    default: null
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  return this.isActive && this.inStock > 0;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.comparePrice || this.comparePrice <= this.price) return 0;
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

export const Product = mongoose.model<IProduct>('Product', productSchema);