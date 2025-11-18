const express = require("express");
const BorrowingController = require("../controllers/borrowingController");

const router = express.Router();

// Sesuai spesifikasi: POST /api/borrowings (create new borrowing)
router.post("/", BorrowingController.borrowBook);

// Sesuai spesifikasi: PUT /api/borrowings/:id/return (process return)
router.put("/:id/return", BorrowingController.returnBook);

// Additional endpoints (keep for backward compatibility)
router.get("/", BorrowingController.getAllBorrowings);
router.get("/overdue", BorrowingController.getOverdueBorrowings);
router.get("/stats", BorrowingController.getBorrowingStats);
router.get("/:id", BorrowingController.getBorrowingById);

module.exports = router;
