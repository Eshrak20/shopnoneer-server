import { Server } from 'http';
import os from 'os';
import app from './app';
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from './app/utils/seedAdmin';

async function bootstrap() {
    let server: Server;

    try {

        await seedSuperAdmin();

        const PORT = Number(envVars.PORT) || 5000;

        // Get local Wi-Fi IP
        const getLocalIp = () => {
            const interfaces = os.networkInterfaces();
            for (const name of Object.keys(interfaces)) {
                for (const net of interfaces[name]!) {
                    if (net.family === 'IPv4' && !net.internal) {
                        return net.address;
                    }
                }
            }
            return 'localhost';
        };
        const localIp = getLocalIp();

        // Start server on all interfaces
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running:`);
            console.log(`   Local:   http://localhost:${PORT}`);
            console.log(`   On Wi-Fi: http://${localIp}:${PORT}`);
        });

        // Graceful shutdown
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed gracefully.');
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.log('Unhandled Rejection detected, closing server...');
            if (server) {
                server.close(() => {
                    console.error(error);
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
}

bootstrap();
