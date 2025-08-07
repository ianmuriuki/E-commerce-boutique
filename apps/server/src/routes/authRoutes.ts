import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  refreshToken
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { validate, authSchemas } from '../middlewares/validation';
import { authLimiter } from '../middlewares/security';

const router = Router();

// Public routes
router.post('/register', authLimiter, validate(authSchemas.register), register);
router.post('/login', authLimiter, validate(authSchemas.login), login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

export default router;