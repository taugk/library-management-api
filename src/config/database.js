const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "library_management",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    client.release();
    return pool;
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error.message);
    console.log("⚠️  Continuing without database connection...");
    return null;
  }
};

module.exports = { pool, connectDB };
