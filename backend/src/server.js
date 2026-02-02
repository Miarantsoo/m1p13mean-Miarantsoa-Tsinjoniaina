import http from "http";
import app from "@/app.js";
import {connectDB, gracefulShutdown} from "@/database.js";

const PORT = Number(process.env.PORT);

const startServer = async () => {
    try {
        await connectDB();

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

