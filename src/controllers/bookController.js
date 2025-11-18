const BookService = require("../services/bookService");

class BookController {
  static async getAllBooks(req, res) {
    try {
      const { title, author, page = 1, limit = 10 } = req.query;

      const filters = {};
      if (title) {
        filters.title = title;
      }
      if (author) {
        filters.author = author;
      }

      const result = await BookService.getAllBooks(
        filters,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: "Books retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getBookById(req, res) {
    try {
      const book = await BookService.getBookById(req.params.id);
      res.json({
        success: true,
        data: {
          ...book,
          available: book.stock > 0,
        },
        message: "Book retrieved successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async createBook(req, res) {
    try {
      const { title, author, published_year, stock, isbn } = req.body;

      // Validation
      if (!title || !author || !published_year || !isbn) {
        return res.status(400).json({
          success: false,
          message: "Title, author, published year, and ISBN are required",
        });
      }

      if (isbn.length !== 13 && isbn.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "ISBN must be 10 or 13 characters long",
        });
      }

      const bookData = {
        title: title.trim(),
        author: author.trim(),
        published_year: parseInt(published_year),
        stock: stock ? parseInt(stock) : 0,
        isbn: isbn.trim(),
      };

      const book = await BookService.createBook(bookData);

      res.status(201).json({
        success: true,
        data: book,
        message: "Book created successfully",
      });
    } catch (error) {
      console.error("Create book error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateBook(req, res) {
    try {
      const { title, author, published_year, stock, isbn } = req.body;

      // Validation
      if (!title || !author || !published_year || !isbn) {
        return res.status(400).json({
          success: false,
          message: "Title, author, published year, and ISBN are required",
        });
      }

      if (isbn.length !== 13 && isbn.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "ISBN must be 10 or 13 characters long",
        });
      }

      const bookData = {
        title: title.trim(),
        author: author.trim(),
        published_year: parseInt(published_year),
        stock: parseInt(stock),
        isbn: isbn.trim(),
      };

      const book = await BookService.updateBook(req.params.id, bookData);

      res.json({
        success: true,
        data: book,
        message: "Book updated successfully",
      });
    } catch (error) {
      console.error("Update book error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteBook(req, res) {
    try {
      await BookService.deleteBook(req.params.id);
      res.json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Delete book error:", error);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAvailableBooks(req, res) {
    try {
      const books = await BookService.getAvailableBooks();
      res.json({
        success: true,
        data: books.map((book) => ({
          ...book,
          available: book.stock > 0,
        })),
        message: "Available books retrieved successfully",
      });
    } catch (error) {
      console.error("Get available books error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = BookController;
