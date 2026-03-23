import app from './app';
import { config } from './config/env';
import { connectDatabase } from './config/db';
import { registerJobs } from './shared/jobs';

/**
 * Start the Express server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    registerJobs();

    // Start Express server
    const server = app.listen(config.port, () => {
      console.log('=================================');
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${config.port}/api/v1`);
      console.log(`💚 Health: http://localhost:${config.port}/health`);
      console.log('=================================');
    });

    // Graceful shutdown handler
    const gracefulShutdown = (signal: string) => {
      console.log(`\n⚠️ ${signal} received, closing server gracefully...`);
      
      server.close(async () => {
        console.log('🛑 HTTP server closed');
        
        try {
          await connectDatabase();
          console.log('🛑 Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();