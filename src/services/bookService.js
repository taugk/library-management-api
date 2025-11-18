const Book = require("../models/book");

class BookService {
  static async getAllBooks(filters = {}, page = 1, limit = 10) {
    try {
      const { title, author } = filters;

      console.log("📖 Filters received:", { title, author, page, limit }); // DEBUG

      let query = "SELECT * FROM books";
      let countQuery = "SELECT COUNT(*) FROM books";
      const queryParams = [];
      const whereConditions = [];

      // Build WHERE clause for filters
      if (title) {
        whereConditions.push(`title ILIKE $${whereConditions.length + 1}`);
        queryParams.push(`%${title}%`);
      }

      if (author) {
        whereConditions.push(`author ILIKE $${whereConditions.length + 1}`);
        queryParams.push(`%${author}%`);
      }

      if (whereConditions.length > 0) {
        const whereClause = " WHERE " + whereConditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
      }

      // Add ordering and pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY title LIMIT $${queryParams.length + 1} OFFSET $${
        queryParams.length + 2
      }`;
      queryParams.push(limit, offset);

      console.log("📖 Final query:", query); // DEBUG
      console.log("📖 Query params:", queryParams); // DEBUG

      // Execute queries
      const books = await Book.findWithQuery(query, queryParams);

      // Get total count
      const countParams = queryParams.slice(0, -2); // Remove limit and offset for count
      const totalResult = await Book.findWithQuery(countQuery, countParams);
      const total = parseInt(totalResult[0]?.count || 0);

      console.log("📖 Books found:", books.length); // DEBUG
      console.log("📖 Total count:", total); // DEBUG

      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);

      return {
        data: books.map((book) => ({
          ...book,
          available: book.stock > 0,
        })),
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        },
      };
    } catch (error) {
      console.error("❌ Error in getAllBooks:", error);
      throw new Error(`Error fetching books: ${error.message}`);
    }
  }
  static async getBookById(id) {
    try {
      const book = await Book.findById(id);
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    } catch (error) {
      throw new Error(`Error fetching book: ${error.message}`);
    }
  }

  static async createBook(bookData) {
    try {
      const existingBook = await Book.findByISBN(bookData.isbn);
      if (existingBook) {
        throw new Error("Book with this ISBN already exists");
      }
      return await Book.create(bookData);
    } catch (error) {
      throw new Error(`Error creating book: ${error.message}`);
    }
  }

  static async updateBook(id, bookData) {
    try {
      const book = await Book.findById(id);
      if (!book) {
        throw new Error("Book not found");
      }
      return await Book.update(id, bookData);
    } catch (error) {
      throw new Error(`Error updating book: ${error.message}`);
    }
  }

  static async deleteBook(id) {
    try {
      const book = await Book.findById(id);
      if (!book) {
        throw new Error("Book not found");
      }
      return await Book.delete(id);
    } catch (error) {
      throw new Error(`Error deleting book: ${error.message}`);
    }
  }

  static async getAvailableBooks() {
    try {
      return await Book.getAvailableBooks();
    } catch (error) {
      throw new Error(`Error fetching available books: ${error.message}`);
    }
  }
}

module.exports = BookService;
