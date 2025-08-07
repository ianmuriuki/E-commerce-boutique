import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { ProductService } from '../services/productService';

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const query = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 12,
    category: req.query.category as string,
    featured: req.query.featured === 'true',
    minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
    maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    sizes: req.query.sizes ? (req.query.sizes as string).split(',') : undefined,
    colors: req.query.colors ? (req.query.colors as string).split(',') : undefined,
    search: req.query.search as string,
    sort: req.query.sort as string,
  };

  const result = await ProductService.getProducts(query);
  
  sendSuccess(res, 'Products retrieved successfully', result.products, 200, result.pagination);
});

export const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.getProductBySlug(req.params.slug);
  sendSuccess(res, 'Product retrieved successfully', product);
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.getProductById(req.params.id);
  sendSuccess(res, 'Product retrieved successfully', product);
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.createProduct(req.body);
  sendSuccess(res, 'Product created successfully', product, 201);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.updateProduct(req.params.id, req.body);
  sendSuccess(res, 'Product updated successfully', product);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id);
  sendSuccess(res, 'Product deleted successfully');
});

export const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  const products = await ProductService.getFeaturedProducts(limit);
  sendSuccess(res, 'Featured products retrieved successfully', products);
});

export const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
  const { productId, categoryId } = req.params;
  const limit = parseInt(req.query.limit as string) || 4;
  
  const products = await ProductService.getRelatedProducts(productId, categoryId, limit);
  sendSuccess(res, 'Related products retrieved successfully', products);
});