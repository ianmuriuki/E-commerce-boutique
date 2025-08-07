import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }
    
    next();
  };
};

// Validation schemas
export const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const productSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
    description: Joi.string().min(10).max(2000).required(),
    price: Joi.number().min(0).required(),
    comparePrice: Joi.number().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).max(10).required(),
    category: Joi.string().hex().length(24).required(),
    sizes: Joi.array().items(Joi.string()).min(1).required(),
    colors: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        hex: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
      })
    ).min(1).required(),
    inStock: Joi.number().min(0).required(),
    sku: Joi.string().required(),
    featured: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0).required(),
      width: Joi.number().min(0).required(),
      height: Joi.number().min(0).required(),
    }).optional(),
    seoTitle: Joi.string().max(60).optional(),
    seoDescription: Joi.string().max(160).optional(),
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    price: Joi.number().min(0).optional(),
    comparePrice: Joi.number().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).max(10).optional(),
    category: Joi.string().hex().length(24).optional(),
    sizes: Joi.array().items(Joi.string()).min(1).optional(),
    colors: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        hex: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
      })
    ).min(1).optional(),
    inStock: Joi.number().min(0).optional(),
    sku: Joi.string().optional(),
    featured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0).required(),
      width: Joi.number().min(0).required(),
      height: Joi.number().min(0).required(),
    }).optional(),
    seoTitle: Joi.string().max(60).optional(),
    seoDescription: Joi.string().max(160).optional(),
  }),
};

export const orderSchemas = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().hex().length(24).required(),
        quantity: Joi.number().min(1).required(),
        size: Joi.string().required(),
        color: Joi.string().required(),
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().default('USA'),
    }).required(),
    billingAddress: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().default('USA'),
    }).optional(),
    paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer', 'cash_on_delivery').required(),
    notes: Joi.string().max(500).optional(),
  }),
};