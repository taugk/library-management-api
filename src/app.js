const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/database");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const borrowingRoutes = require("./routes/borrowingRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/books", bookRoutes);

app.use("/api/members", memberRoutes);

app.use("/api/borrowings", borrowingRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Library Management API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API documentation route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Library Management System API",
    version: "1.0.0",
    endpoints: {
      books: {
        "GET /api/books": "Get all books",
        "GET /api/books/available": "Get available books",
        "GET /api/books/:id": "Get book by ID",
        "POST /api/books": "Create new book",
        "PUT /api/books/:id": "Update book",
        "DELETE /api/books/:id": "Delete book",
      },
      members: {
        "GET /api/members": "Get all members",
        "GET /api/members/:id": "Get member by ID",
        "GET /api/members/:id/borrowing-history":
          "Get member borrowing history",
        "POST /api/members": "Create new member",
        "PUT /api/members/:id": "Update member",
        "DELETE /api/members/:id": "Delete member",
      },
      borrowings: {
        "GET /api/borrowings": "Get all borrowings",
        "GET /api/borrowings/:id": "Get borrowing by ID",
        "POST /api/borrowings/borrow": "Borrow a book",
        "PUT /api/borrowings/return/:id": "Return a book",
      },
    },
  });
});

// Root route
app.get("/", (req, res) => {
  res.redirect("/api");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
🚀 Library Management System API Started!

📍 Server running on port: ${PORT}
📚 API Documentation: http://localhost:${PORT}/api
❤️  Health Check: http://localhost:${PORT}/health

✅ Ready to accept requests!
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start the application
if (require.main === module) {
  startServer();
}

module.exports = app;
