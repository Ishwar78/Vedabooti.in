import mongoose from "mongoose";
import dns from "node:dns";

// Configure reliable DNS servers to handle MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("[Database] Could not set custom DNS servers, using system default.");
}

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoUrl);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("[Database] MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
