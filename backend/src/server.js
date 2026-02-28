import '@/config/env.config.js';

import http from "http";
import app from "@/app.js";
import {connectDB, gracefulShutdown} from "@/database.js";
import {runSeed} from "@/seeds/seed.js";

const PORT = Number(process.env.BACKEND_PORT);

const startServer = async () => {
    try {
        await connectDB();
        await runSeed();

        const httpServer = http.createServer(app);

        httpServer.listen(PORT, () => {
            console.log(`MEAN Project backend listening on port ${PORT}`);
        });

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('Error on server startup:', error);
        process.exit(1);
    }
};

startServer();

