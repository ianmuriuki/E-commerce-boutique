import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import categoryRoutes from './categoryRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luxora API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

export default router;