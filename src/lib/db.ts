import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (isConnected) {
        return mongoose;
    }

    console.log("process.env.MONGODB_URI", process.env.MONGODB_URI);

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MongoDB connection URI is not defined in .env');
    }

    try {
        const db = await mongoose.connect(mongoUri, {
            dbName: process.env.MONGODB_DB || undefined,
        });

        isConnected = true;
        console.log('✅ MongoDB connected');
        return db;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
}
