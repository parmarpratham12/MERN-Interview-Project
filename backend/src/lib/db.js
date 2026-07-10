import mongoose from "mongoose";
import ENV from "./env.js";

export const connectDB = async () => {
  try {
     const conn = await mongoose.connect(ENV.DB_URL, { });
    console.log(" Connected successfully✅", conn.connection.host);
  } catch (error) {
    console.error("❌Connection failed due to ", error);
    process.exit(1); // Exit the process with an error code 0=sucess, 1=error
    
  } }