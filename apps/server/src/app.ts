import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';

import { corsOptions, helmetConfig, generalLimiter } from './middlewares/security';
import { globalErrorHandler, notFound } from './middlewares/errorHandler';
import routes from './routes';
import { isDevelopment } from './config/environment';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes all mounted in /api/v1
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Luxora Boutique API',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// Handle undefined routes
app.all('*', notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;