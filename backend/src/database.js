import mongoose from "mongoose";

const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME;
const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD;
const MONGO_DATABASE = process.env.MONGO_DATABASE;
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@localhost:27017/${MONGO_DATABASE}?authSource=admin`;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB');
        console.log(`Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received, graceful shutdown...`);

    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error while closing MongoDB connection:', error);
        process.exit(1);
    }
};

mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected to MongoDB');
});