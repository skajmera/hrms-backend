"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const jobs_1 = require("./shared/jobs");
/**
 * Start the Express server
 */
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, db_1.connectDatabase)();
        (0, jobs_1.registerJobs)();
        // Start Express server
        const server = app_1.default.listen(env_1.config.port, () => {
            console.log('=================================');
            console.log(`🚀 Server running on port ${env_1.config.port}`);
            console.log(`📝 Environment: ${env_1.config.nodeEnv}`);
            console.log(`🔗 API: http://localhost:${env_1.config.port}/api/v1`);
            console.log(`💚 Health: http://localhost:${env_1.config.port}/health`);
            console.log('=================================');
        });
        // Graceful shutdown handler
        const gracefulShutdown = (signal) => {
            console.log(`\n⚠️ ${signal} received, closing server gracefully...`);
            server.close(async () => {
                console.log('🛑 HTTP server closed');
                try {
                    await (0, db_1.connectDatabase)();
                    console.log('🛑 Database connection closed');
                    process.exit(0);
                }
                catch (error) {
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
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Start the server
startServer();
//# sourceMappingURL=server.js.map