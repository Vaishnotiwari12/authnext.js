import mongoose from "mongoose";

export async function connect() {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in the environment variables");
    }

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("MongoDB connection failed");
    }
}