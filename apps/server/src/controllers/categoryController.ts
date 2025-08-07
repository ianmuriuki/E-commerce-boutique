import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { Category } from '../models/Category';
import { AppError } from '../utils/AppError';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true })
    .sort('sortOrder name')
    .populate('productsCount');
  
  sendSuccess(res, 'Categories retrieved successfully', categories);
});

export const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  }).populate('productsCount');
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  sendSuccess(res, 'Category retrieved successfully', category);
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.create(req.body);
  sendSuccess(res, 'Category created successfully', category, 201);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  sendSuccess(res, 'Category updated successfully', category);
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  sendSuccess(res, 'Category deleted successfully');
});