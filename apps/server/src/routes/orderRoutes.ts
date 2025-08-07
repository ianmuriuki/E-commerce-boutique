import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  updatePaymentStatus,
  getUserOrders,
  getOrderStats
} from '../controllers/orderController';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth';
import { validate, orderSchemas } from '../middlewares/validation';

const router = Router();

// Public routes
router.post('/', validate(orderSchemas.create), createOrder);
router.get('/number/:orderNumber', getOrderByNumber);

// User routes
router.use(authenticate);
router.get('/my-orders', getUserOrders);

// Admin routes
router.use(authorize('admin'));
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/payment', updatePaymentStatus);

export default router;