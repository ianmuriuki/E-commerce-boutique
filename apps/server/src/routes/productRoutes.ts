import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getRelatedProducts
} from '../controllers/productController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, productSchemas } from '../middlewares/validation';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.get('/:productId/related/:categoryId', getRelatedProducts);

// Admin routes
router.use(authenticate, authorize('admin'));
router.post('/', validate(productSchemas.create), createProduct);
router.patch('/:id', validate(productSchemas.update), updateProduct);
router.delete('/:id', deleteProduct);

export default router;