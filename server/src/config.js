import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || "devsecret",
  CORS_ORIGIN: (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174").split(","),
};

export async function connectDB() {
  if (!env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(env.MONGODB_URI);
  console.log("✅ MongoDB connected");
}
