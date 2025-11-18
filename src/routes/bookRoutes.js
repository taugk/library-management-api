const express = require("express");
const BookController = require("../controllers/bookController");

const router = express.Router();

// Sesuai spesifikasi: GET /api/books (list all books with filters)
router.get("/", BookController.getAllBooks);

// Additional endpoints
router.get("/available", BookController.getAvailableBooks);
router.get("/:id", BookController.getBookById);
router.post("/", BookController.createBook);
router.put("/:id", BookController.updateBook);
router.delete("/:id", BookController.deleteBook);

module.exports = router;
