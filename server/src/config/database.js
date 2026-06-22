import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("MongoDB URI not provided. Using seeded in-memory demo data.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to in-memory demo data.");
    console.warn(error.message);
    return false;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
