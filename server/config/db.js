import mongoose from "mongoose";
import dns from "node:dns";

// Configure reliable DNS servers and force IPv4 first for Windows / MongoDB Atlas SRV lookup
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("[Database] Could not set custom DNS servers:", e.message);
}

export const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  try {
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn("[Database] Primary SRV connection failed, attempting replica set fallback...", error.message);

    // Direct replica-set connection fallback if SRV lookup failed
    const directFallbackUrl =
      "mongodb://ishwarwebmok_db_user:webmok12345@ac-ayrcuiw-shard-00-00.zteyprk.mongodb.net:27017,ac-ayrcuiw-shard-00-01.zteyprk.mongodb.net:27017,ac-ayrcuiw-shard-00-02.zteyprk.mongodb.net:27017/Vedabooti?ssl=true&replicaSet=atlas-ayrcuiw-shard-0&authSource=admin&retryWrites=true&w=majority";

    try {
      const conn = await mongoose.connect(directFallbackUrl, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`[Database] MongoDB Connected (Fallback): ${conn.connection.host} / ${conn.connection.name}`);
      return conn;
    } catch (fallbackError) {
      console.error("[Database] MongoDB Connection Error:", fallbackError.message);
      process.exit(1);
    }
  }
};

export default connectDB;
