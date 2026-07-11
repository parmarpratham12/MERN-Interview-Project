import mongoose from "mongoose";
import ENV from "./env.js";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  if (!ENV.DB_URL) {
    throw new Error("DB_URL is not defined in the environment variables");
  }

  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("Connected successfully to DB ✅", conn.connection.host);
  } catch (error) {
    console.error("❌ Connection failed due to: ", error);
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};