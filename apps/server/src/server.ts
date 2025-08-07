import app from './app';
import { config } from './config/environment';
import { connectDatabase } from './config/database';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Luxora API Server running on port ${config.PORT}`);
      console.log(`📍 Environment: ${config.NODE_ENV}`);
      console.log(`🌐 API URL: http://localhost:${config.PORT}/api/v1`);
      console.log(`📚 Health Check: http://localhost:${config.PORT}/api/v1/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.log('⚠️  Forcing shutdown after 10 seconds');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();